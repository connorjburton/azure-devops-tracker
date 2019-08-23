import React from 'react';
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
		this.db.get().then(docs => this.setState({ tasks: docs.rows }));
	}

	addTask() {
		this.db.add({
			wi: '',
			start: '',
			end: '',
			description: ''
		});
	}

	updateTask(task, rev, key, event) {
		const newTask = Object.assign({}, task, {
			_rev: rev,
			[key]: event.target.value
		});
		
		this.db.update(newTask);
	}

	syncTask(task) {
		this.azure.getWi(task.doc.wi).then(result => {
			this.db.update(Object.assign(task.doc, {
				description: result.body.fields['System.Title']
			}));
		});
	}

	renderTask(task) {
		return (
			<div key={task.doc._id}>
				<span onClick={this.syncTask.bind(this, task)}>{'Refresh'}</span>
				<span>{task.doc.description}</span>
				<input type="text" value={task.doc.wi} onChange={this.updateTask.bind(this, task.doc, task.value.rev, 'wi')} />
				<input type="text" value={task.doc.start} onChange={this.updateTask.bind(this, task.doc, task.value.rev, 'start')} />
				<input type="text" value={task.doc.end} onChange={this.updateTask.bind(this, task.doc, task.value.rev, 'end')} />
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
