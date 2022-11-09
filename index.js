const express = require('express');
const cors = require('cors');
const Y = require('yjs');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
let currentPeople = [];
let documents = new Map();

app.use((req, res, next) => {
    res.setHeader('X-CSE356', '6306e95158d8bb3ef7f6c4c7'); //Setting our header no matter request
    next();
})

const userRouter = require('./server/routes/user-router') //requiring and using routes from server folder
app.use(userRouter)

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
            let ydoc = new Y.Doc();
            documents.set(id, ydoc);
            console.log("made doc with id: " + id);
        }
        const fullState = Y.encodeStateAsUpdate(documents.get(id));
        const makingArray = Array.from(fullState);
        const ableToSend = JSON.stringify(makingArray);
        let newClient = {
            id: id,
            res
        };
        if (currentPeople.indexOf(newClient) === -1) {
            currentPeople.push(newClient);
        }
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

function msgToAll(msg, id) {
    currentPeople.forEach(person => {
        if (person.id == id) {
            person.res.write(`event: update\ndata: ${JSON.stringify(msg)}\n\n`);
        }
    });
}


async function postingHelper(req, res, next) {
    let { id } = req.params
    let grabTrueDoc = documents.get(id);
    let gettingU = Uint8Array.from(req.body)
    Y.applyUpdate(grabTrueDoc, gettingU);
    res.status(200).send('updated post');
    return msgToAll(req.body, id);

};

async function getList() {
    const response = await fetch('/list');

    if (!response.ok) {
        const message = `An error has occured: ${response.status}`;
        throw new Error(message);
    }

    let listOfDocuments = response.data.documents; //retrieving map of documents
    let top10Docs = new Map(); //creating new map for the top 10 recently edited
    index = 0; //index used to keep track of Map with size 10

    for (let [key, value] of listOfDocuments.entries()) {
        //REQUIRMENT: a variable to determine document that was most recently edited
        //like a timestamp of some sorts added to the value when applying updates
        if (index < 10) {
            top10Docs.set(key, value)
            index++;
        }
    }
    return top10Docs;
}

app.get('/collection', getList);
app.post('/api/op/:id', postingHelper);
app.use('/library/crdt.js', express.static(path.join(__dirname, '/dist/crdt.js')));
app.listen(80);
console.log("listening on port 80");

export { documents }; //likely to be removed for homepage implementation
