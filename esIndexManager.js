const client = require('./connection')
//class used to create Index to hold all of our documents

class EsIndexManager{

    constructor(indexName){
        this.indexName = indexName || `hexaquoteindex`;
    }

    //creating a index
    createIndex(){
        return client.indices.create({
            index: this.indexName
        });
    }

    //check if index exists
    indexExists(){
        return client.indices.exists({
            index: this.indexName
        });
    }

    //delete index by index name
    deleteIndex(){
        return client.indices.delete({
            index: this.indexName
        });
    }

    //add/update a document
    addDocument(_id, _payload){
        client.index({
            index: this.indexName,
            id: _id,
            body: _payload
        }, function(err, resp){
            if(err){
                console.log(err);
            } else {
                console.log("added or updated", resp);
            }
        })            
    }
    
}

module.exports = EsIndexManager //needed this or creating new constructor wont work :<<