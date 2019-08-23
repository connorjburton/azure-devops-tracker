import React from 'react';
import get from 'lodash/get';
import has from 'lodash/get';

import Constants from './Constants.js';
import DB from './DB.js';

class Pat extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pat: undefined
        }

        this.db = new DB(Constants.DB.PAT);

        this.listener = null;

		this.onDBChange = this.onDBChange.bind(this);
	}

	componentDidMount() {
		this.listener = this.db.attachListener(this.onDBChange);
		this.onDBChange();
	}

	componentWillUnmount() {
		this.db.detatchListener(this.listener);
	}

	onDBChange() {
		this.db.get().then(docs => this.setState({ pat: docs.rows[0] }));
	}

    onChange(event) {
        let method = 'add';
        const doc = {
            value: event.target.value
        };

        if (has(this.state.pat, 'doc')) {
            method = 'update';
            doc._id = this.state.pat.id;
            doc._rev = this.state.pat.value.rev;         
        }

		this.db[method](doc);
	}

    render() {
        return (
            <div>
                <span>{'Please enter your PAT here'}</span>
                <input type={'text'} value={get(this.state.pat, 'doc.value')} onChange={this.onChange.bind(this)} />
            </div>
        )
    }
}

export default Pat;
