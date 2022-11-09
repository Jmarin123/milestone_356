const Document = require('../model/documents')
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');

createDocument = async (req, res) => {
    let { name } = req.query;
    let id = crypto.randomUUID();

    const newDocument = new Document({
        name: name,
        id: id,
        body: '',
        timeCreated: Date.now(),
        timeModified: Date.now()
    });
    await Document.exists({ id }).then(async (exists) => {
        if (exists) {
            res.send(`Error: document ID "${id}" already exists.`, 400);
        } else {
            await newDocument.save().then(() => {});
            res.send(id, 200);
        }
    });
}

deleteDocument = async (req, res) => {
    let { id } = req.query;

    Document.exists({ id }).then(async (exists) => {
        if (exists) {
            await Document.deleteOne({ id }).then(() => {});
            res.send(`Successfully deleted document with ID ${id}`, 200);
        } else {
            res.send(`Error: document with ID ${id} does not exist`, 400);
        }
    });
}

getDocumentList = async (req, res) => {
    const mostRecentDocuments = await Document.find({}).sort({lastModified: 'desc'}).limit(10).lean()
    res.send(mostRecentDocuments, 200);
}

module.exports = {
    createDocument,
    deleteDocument,
    getDocumentList
}