const express = require('express');
const cors = require('cors');
const Y = require('yjs');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const multer = require('multer')
const uploadPos = multer({ dest: 'uploads/' });
const mongoose = require('mongoose');
const ejsEngine = require('ejs-mate');
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, '/uploads/my-images');
    },
    filename: function (req, file, callback) {
        let varTime = Date.now();
        callback(null, file.fieldname + '-' + varTime + path.extname(file.originalname));
    }
});
let upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var ext = path.extname(file.originalname);
        if (ext !== '.jepg' && ext !== '.png') {
            return callback(new Error('Only images are allowed'))
        }
        callback(null, true)
    }
}).single('file');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', ejsEngine);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
let currentPeople = [];
let documents = new Map();
let counter = 1;
mongoose.connect('mongodb://localhost:27017/myapp');
app.use((req, res, next) => {
    res.setHeader('X-CSE356', '6306e95158d8bb3ef7f6c4c7'); //Setting our header no matter request
    next();
})

const userRouter = require('./server/routes/user-routes') //requiring and using routes from server folder
app.use(userRouter)

app.use('/test', express.static(path.join(__dirname, '/dist')));

function helper(req, res, next) {
    if (req.cookies && req.cookies.name) {
        try {
            let headers = {
                'Content-Type': 'text/event-stream',
                'Connection': 'keep-alive',
                'Cache-Control': 'no-cache'
            };
            let { id } = req.params;
            res.writeHead(200, headers);
            let data;
            id = parseInt(id);
            const fullState = Y.encodeStateAsUpdate(documents.get(id).document);
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
            // data = `event: presence\ndata: {}\n\n`
            // res.write(data);
            res.on('close', () => {
                console.log(`Connection closed`);
                //currentPeople = currentPeople.filter(client => client.id !== id);
            });
        } catch (e) {
            console.log("WTFFFF");
        }
    } else {
        return res.json({ error: true, message: "Login before connecting" });
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
    if (req.cookies && req.cookies.name) {
        let { id } = req.params
        id = parseInt(id);
        let grabTrueDoc = documents.get(id).document;
        let gettingU = Uint8Array.from(req.body)
        Y.applyUpdate(grabTrueDoc, gettingU);
        let newTime = Date.now();
        let currentObj = {
            name: documents.get(id).name,
            document: grabTrueDoc,
            lastEdited: newTime
        }
        documents.set(id, currentObj);
        res.status(200).send('updated post');
        return msgToAll(req.body, id);
    }
    return res.json({ error: true, message: "Unauthorized status code" });
};

app.post('/api/op/:id', postingHelper);
app.use('/library/crdt.js', express.static(path.join(__dirname, '/dist/crdt.js')));

app.post('/collection/create', (req, res) => {
    if (req.cookies && req.cookies.name) {
        const { name } = req.body;
        let ydoc = new Y.Doc();
        let currentTime = Date.now();
        let currentObj = {
            name: name,
            document: ydoc,
            lastEdited: currentTime
        }
        documents.set(counter, currentObj);
        let returnJson = {
            id: counter
        }
        counter++;
        return res.send(returnJson);
    }
    return res.json({ error: true, message: "Unauthorized status code" });
});

app.post('/collection/delete', (req, res) => {
    if (req.cookies && req.cookies.name) {
        const { id } = req.body;
        console.log(id);
        documents.delete(id);
        return res.sendStatus(200);
    }
    return res.json({ error: true, message: "Unauthorized status code" });
})


app.get('/collection/list', (req, res) => {
    if (req.cookies && req.cookies.name) {
        let allCollections = [];
        let ordered = [...documents.entries()].sort((a, b) => b[1].lastEdited - a[1].lastEdited);
        let totalSize = 10;
        if (ordered.length < totalSize) totalSize = ordered.length;
        for (let i = 0; i < totalSize; i++) {
            const addObj = {
                id: ordered[i][0],
                name: ordered[i][1].name
            }
            allCollections.push(addObj);
        }
        allCollections = JSON.stringify(allCollections);
        return res.send(allCollections);
    }
    return res.json({ error: true, message: "Unauthorized status code" });

})

app.get("/home", (req, res) => {
    return res.render('index');
})


app.post('/media/upload', (req, res) => {
    if (req.cookies && req.cookies.name) {
        upload(req, res, function (err) {
            if (err) {
                return res.json({ error: true, message: "Bad upload" });
            }
            else {
                console.log("Image was uploaded");
            }
        });
    }
    return res.json({ error: true, message: "Unauthorized status code" });
})

app.get('/media/access/:mediaid', (req, res) => {
    if (req.cookies && req.cookies.name) {
        var options = {
            root: path.join(__dirname, 'uploads'),
            //headers: { 'Content-type': 'image/jpg' }
        };
        let { mediaid } = req.params;
        return res.sendFile(`${mediaid}`, options);
    }
    return res.json({ error: true, message: "Unauthorized status code" });
})

app.listen(80);
console.log("listening on port 80");

//export { documents }; //likely to be removed for homepage implementation
// async function getList() {
//     const response = await fetch('/collections/list');

//     if (!response.ok) {
//         const message = `An error has occured: ${response.status}`;
//         throw new Error(message);
//     }

//     let listOfDocuments = response.data.documents; //retrieving map of documents
//     let top10Docs = new Map(); //creating new map for the top 10 recently edited
//     index = 0; //index used to keep track of Map with size 10

//     for (let [key, value] of listOfDocuments.entries()) {
//         //REQUIRMENT: a variable to determine document that was most recently edited
//         //like a timestamp of some sorts added to the value when applying updates
//         //currentObjlastEdited
//         //currentObj.name
//         if (index < 10) {
//             top10Docs.set(key, value)
//             index++;
//         }
//     }
//     return top10Docs;
// }