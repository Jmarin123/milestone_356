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
let counter = 0;
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
// if (documents.get(id) === undefined) {
//     let ydoc = new Y.Doc();
//     documents.set(id, ydoc);
//     console.log("made doc with id: " + id);
// }

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

app.post('/api/op/:id', postingHelper);
app.use('/library/crdt.js', express.static(path.join(__dirname, '/dist/crdt.js')));

app.post('/collection/create', (req, res) => {
    const { name } = req.body;
    let ydoc = new Y.Doc();
    let currentTime = Date.now();
    let currentObj = {
        name: name,
        document: ydoc,
        lastEdited: currentTime
    }
    documents.set(counter, currentObj);
    return res.send(counter++);
});

app.post('/collection/delete', (req, res) => {
    const { id } = req.body;
    documents.delete(id);
})


app.post('/collection/list', (req, res) => {
    let allCollections = [];
    for (let [key, value] of documents) {
        if (allCollections.length === 10) {
            break;
        }

    }
    return res.send(allCollections);
})


app.listen(80);
console.log("listening on port 80");
