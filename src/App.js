import React from 'react';
import get from 'lodash/get';
import moment from 'moment';

import './App.css';

import Constants from './Constants.js';
import Pat from './Pat.js';
import DB from './DB.js';
import Azure from './Azure.js';

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			tasks: []
		};

		this.db = new DB(Constants.DB.TASKS);
		this.azure = new Azure();
		this.azure.waitForReady().then();
		this.listener = null;

		this.onDBChange = this.onDBChange.bind(this);
		this.addTask = this.addTask.bind(this);
	}

	componentDidMount() {
		this.listener = this.db.attachListener(this.onDBChange);
		this.onDBChange();
	}

	componentWillUnmount() {
		this.db.detatchListener(this.listener);
	}

	onDBChange() {
		this.db.get().then(docs => this.setState({ tasks: docs.rows.map(row => row.doc) }));
	}

	addTask() {
		this.db.add({
			wi: '',
			start: '',
			end: '',
			description: ''
		});
	}

	updateTask(task, key, value) {
		// if we are event object
		if (typeof value === 'object') {
			value = value.target.value;
		}

		const newTask = Object.assign({}, task, {
			[key]: value
		});
		
		this.db.update(newTask).then(result => {
			if (result.ok) {
				console.log(`${task.description} updated`);
			}
		}).catch(err => {
			console.error(err);
		});
	}

	syncTask(task) {
		return this.azure.getWi(task.wi).then(result => {
			return this.db.update(Object.assign({}, task, {
				description: result.body.fields['System.Title'],
				remaining: result.body.fields[Constants.AZURE.FIELDS.REMAINING],
				completed: result.body.fields[Constants.AZURE.FIELDS.COMPLETED]
			}));
		});
	}

	canSubmitTime(task) {
		let start = get(task, 'start', '');
		let end = get(task, 'end', '');

		if (start.length !== 5 || end.length !== 5) {
			return false;
		}

		start = parseInt(start.replace(':', ''));
		end = parseInt(end.replace(':', ''));

		if (!Number.isFinite(start) || !Number.isFinite(end)) {
			return false;
		}

		if (start >= end) {
			return false;
		}

		return true;
	}

	submitTime(task) {
		if (!this.canSubmitTime(task)) {
			return false;
		}

		return this.syncTask(task).then(result => {
			if (!result.ok) {
				throw new Error('Syncing task failed');
			}

			task = this.state.tasks.find(stateTask => stateTask._id === task._id);
			if (!task) {
				throw new Error('Cant find task');
			}

			const start = moment(task.start, 'hh:mm');
			const end = moment(task.end, 'hh:mm');

			return this.azure.updateWi(task.wi, Constants.AZURE.FIELDS.COMPLETED, parseFloat(task.completed) + end.diff(start, 'hours', true));
		}).then(response => {
			return this.updateTask(task, 'completed', response.body.fields[Constants.AZURE.FIELDS.COMPLETED]);
		});
	}

	renderTask(task) {
		return (
			<div key={task._id}>
				<span onClick={this.syncTask.bind(this, task)}>{'Refresh'}</span>
				<span>{task.description}</span>
				<input type="text" value={task.wi} onBlur={this.syncTask.bind(this, task)} onChange={this.updateTask.bind(this, task, 'wi')} />
				<input type="text" value={task.start} placeholder={'10:30'} onBlur={this.syncTask.bind(this, task)} onChange={this.updateTask.bind(this, task, 'start')} />
				<input type="text" value={task.end} placeholder={'13:15'} onBlur={this.syncTask.bind(this, task)} onChange={this.updateTask.bind(this, task, 'end')} />
				<span>{`Remaining = ${task.remaining}hrs. Completed = ${task.completed}hrs`}</span>
				<span onClick={this.submitTime.bind(this, task)}>{'Submit Time'}</span>
			</div>
		)
	}

	render() {
		return (
			<div className={'App'}>
				<Pat />

				{this.state.tasks.map(this.renderTask.bind(this))}
				<button onClick={this.addTask}>{'Add Task'}</button>
			</div>
		);
	}
}

export default App;
