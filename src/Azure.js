import DB from "./DB";
import Constants from './Constants.js';
import superagent from 'superagent';

class Azure {
    constructor() {
        this.dbs = {
            pat: new DB(Constants.DB.PAT)
        }

        this.pat = undefined;

        this.listener = null;
		this.onDBChange = this.onDBChange.bind(this);
	}

	componentDidMount() {
		this.listener = this.dbs.pat.attachListener(this.onDBChange);
		this.onDBChange();
	}

	componentWillUnmount() {
		this.dbs.pat.detatchListener(this.listener);
	}

	onDBChange() {
		return this.dbs.pat.get().then(docs => this.pat = docs.rows[0].doc.value);
	}

    waitForReady() {
        return this.onDBChange();
    }

    query(method, path, query, body) {
        const url = new URL(`${Constants.AZURE.URL}${path}`);
        url.searchParams.append('api-version', Constants.AZURE.VERSION);
        
        const request = superagent[method](url.href)
            .accept('application/json')    
            .set('Authorization', `Basic ${window.btoa(`:${this.pat}`)}`);

        if (body) {
            request.send(body);
        }

        return request;
    }

    getWi(id) {
        return this.query('get', `wit/workitems/${id}`);
    }
}

export default Azure;
