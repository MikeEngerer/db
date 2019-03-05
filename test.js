const { Database } = require('./Database')

const db = new Database('test_database_owner', 'test_database_name', './test_database_3.json')

db.createCollection()

let coll = db.findCollection('collection_0')

db.findDocument()
// console.log(coll)
// console.log(db.collections)

// db.createDocument('test_collection', {row_1: 'item_1', row_2: 'item_2'}, 'document_1')

// const collection = db.findCollection('test_collection')

// let document = db.findDocument('test_collection1', 'document_1')
