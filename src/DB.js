import PouchDB from 'pouchdb';

class DB {
    constructor(name) {
        this.db = new PouchDB(name);
    }

    attachListener(listener) {
        return this.db.changes({
            since: 'now',
            live: true,
            include_docs: true
        }).on('change', listener).on('error', console.error);
    }

    detatchListener(listener) {
        listener.cancel();
    }

    get() {
        return this.db.allDocs({ include_docs: true });
    }

    add(doc) {
        return this.db.post(doc);
    }

    update(doc) {
        return this.db.put(doc);
    }
}

export default DB;