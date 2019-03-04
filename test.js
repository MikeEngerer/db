const { Database } = require('./Database')

const db = new Database('test_database_owner', 'test_database_name', './test_database.json')

db.createCollection('test_collection')

db.createDocument('test_collection', {row_1: 'item_1', row_2: 'item_2'}, 'document_1')

const collection = db.findCollection('test_collection')

console.log(collection)