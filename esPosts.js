//USING CLASS TO CREATE POST INSTANCES TO INSERT INTO DOCUMENTS INDEX

class Posts {

    constructor(docID, docTitle, docContent){
        this.docID = docID;
        this.docTitle = docTitle
        this.docContent = docContent;
    }
}

module.exports = Posts