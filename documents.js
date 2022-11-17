//Client Side Code for creating the DOCUMENTS index
const esIndexManager = require('./esIndexManager');
const Post = require('./esPosts');
const client = require('./connection')

//create index called documents
let indexManager = new esIndexManager("documents");
//indexManager.createIndex(); //creating the index (ONLY NEED TO RUN THIS ONCE AND THEN COMMENT IT OUT)

//creating an instance of the Post(to put into documents index)
const newPost = new Post("4321", "anotha one", "testing to see if search works now pls.");

//convert post class to json
//const jsonPost = JSON.stringify(newPost);
//console.log(jsonPost);

//add the document to index:(DOCUMENTS)
//indexManager.addDocument('3', jsonPost); 
//if the same id is given('1') then the index just updates that document with the new 'jsonPost' obj

//searching for documents by keyword
async function gettingresult(){
    var search = {
        index: 'documents',
        "body": {
            'query': {
            "match": {
                "docContent": 'skill'
            }
        }
    }};
    const result = await client.search(search);
    console.log(result);
    
}
gettingresult();

// const result = await client.search({
//     index: 'documents',
//     "body": {
//         "query": {
//             "match": {
//                 "docContent": "skill"
//             }
//         }
//     }
// });





