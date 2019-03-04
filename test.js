const { Database } = require('./Database')

const db = new Database('test_database_owner', 'test_database_name', './test_database.json')

db.createCollection('test_collection')

db.createDocument('test_collection', {a: 1, b: 2, c: 4}, 'test_document')

db.updateDocument('test_collection', 'test_document', {c: 5, d:4})

db.deleteDocument('test_collection', 'test_document')

db.deleteCollection('test_collection')

db.deleteDatabase()
// console.log(db.collections)

// db.createDocument('test_collection', {row_1: 'item_1', row_2: 'item_2'}, 'document_1')

// const collection = db.findCollection('test_collection')

// let document = db.findDocument('test_collection1', 'document_1')
