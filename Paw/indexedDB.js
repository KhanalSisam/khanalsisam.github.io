export function DBoperation( QUERY){
    
    // window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

    if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
    }


    var db;
    var request = window.indexedDB.open("log", "1");

    request.onupgradeneeded = (event) => {
        // exists = false
        let db = event.target.result;
        let store = db.createObjectStore("Texts", {
            autoIncrement: true
        })
        let index = store.createIndex("id", "id", {
            unique: true
        })
    }

    function necessary(query, db, txn) {
        query.onerror = event => {
            console.log(event.target.errorCode)
        }
        txn.oncomplete = () => {
            db.close()
        }
    }

    function insertText(db, text) {
        const txn = db.transaction("Texts", "readwrite")
        const store = txn.objectStore("Texts")
        let query = store.add(text, text.id)

        query.onsuccess = event => {
            console.log(event)
        }
        query.onerror = event => {
            console.log("was already added")
        }
        query.oncomplete = () => {
            db.close()
        }
    }
    function getAllId(db, callback) {
        const txn = db.transaction("Texts", "readonly")
        const store = txn.objectStore("Texts")
        const query = store.getAllKeys()
        query.onsuccess = e => {
            callback(query.result)
        }
        query.oncomplete = () => {
            db.close()
        }
    }
    function updateTextLog(db, newLog ) {
        const txn = db.transaction("Texts", "readwrite")
        const store = txn.objectStore("Texts")
        const textQuery = store.get(newLog.id)
        textQuery.onsuccess = () => {
            const text = textQuery.result
            text.progress = newLog.progress
            text.last = newLog.last
            console.log(text)
            const query =
                store.put(text, text.id).onsuccess = () => {
                console.log("updated text log data")
            }
            necessary(query, db, txn)
        }
        necessary(textQuery, db, txn)
    }

    function deleteTextLog(db, id) {
        const txn = db.transaction("Texts", "readwrite")
        const store = txn.objectStore("Texts")
        let query = store.delete(id)
        query.onsuccess = event => {
            console.log(event)
        }
        necessary(query, db, txn)
    }

    request.onerror = function (event) {
        console.error("Database error: " + event.target.errorCode);
    };

    request.onsuccess = function (event) {
        db = event.target.result;
        if (QUERY.newText) {
            insertText(db, QUERY.newText)
        }
        else if (QUERY.getAll) {
            const txn = db.transaction("Texts", "readonly")
            const store = txn.objectStore("Texts")
            const query = store.getAll()
            query.onsuccess = e => {
                QUERY.getAll(query.result)
            }
            query.oncomplete = () => {
                db.close()
            }
        } else if (QUERY.newLog) {
            updateTextLog(db, QUERY.newLog)
        } else if (QUERY.getAllId) {
            getAllId(db, QUERY.getAllId)
        }
    };
}

// newText=false,update=false,getAll=false, deleteText=false