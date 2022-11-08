const express = require('express');
const cors = require('cors');
const Y = require('yjs');
const app = express();
const path = require('path');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
let currentPeople = [];
let documents = new Map();

app.use((req, res, next) => {
    res.setHeader('X-CSE356', '6306e95158d8bb3ef7f6c4c7'); //Setting our header no matter request
    next();
})

app.use('/test', express.static(path.join(__dirname, '/dist')));

function helper(req, res, next) {
    try {
        let headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        let { id } = req.params;
        res.writeHead(200, headers);
        let data;
        if (documents.get(id) === undefined) {
            //documents.set(id, "");
            let ydoc = new Y.Doc();
            documents.set(id, ydoc);
        }
        const fullState = Y.encodeStateAsUpdate(documents.get(id));
        const ableToSend = JSON.stringify(fullState);
        let newClient = {
            id: id,
            res
        };
        currentPeople.push(newClient);
        //console.log("syncing!: " + documents.get(id).getText().toDelta());
        data = `event: sync\ndata: ${ableToSend}\n\n`
        res.write(data);
        res.on('close', () => {
            console.log(`Connection closed`);
            //currentPeople = currentPeople.filter(client => client.id !== id);
        });
    } catch (e) {
        console.log("WTFFFF");
    }
};

app.get('/api/connect/:id', helper);

async function postingHelper(req, res) {
    let { id } = req.params
    let grabTrueDoc = documents.get(id);
    let gettingU = req.body
    Y.applyUpdate(grabTrueDoc, gettingU);
    //console.log(grabTrueDoc.getText().toDelta());
    //console.log("working with id: " + id);
    currentPeople.forEach(person => {
        if (person.id == id) {
            //console.log("sent update to person");
            person.res.write(`event: update\ndata: ${JSON.stringify(req.body)}\n\n`);
        }
    });
    return res.status(200).send('updated post');;

};

app.post('/api/op/:id', postingHelper);
app.use('/library/crdt.js', express.static(path.join(__dirname, '/dist/crdt.js')));
app.listen(80);
console.log("listening on port 80");
