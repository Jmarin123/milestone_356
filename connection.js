//Connection to ElasticSearch-->Connection.js file encapsulate connection to elastic-search.
const elasticsearch = require('elasticsearch');

var client = new elasticsearch.Client( {
    host: 'localhost:9200',
    log: 'trace',
    apiVersion: 'master'
});

module.exports = client