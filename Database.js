const fs = require('fs');
const moment = require('moment');


class Database {

  constructor(owner, name, path = './database.json') {
    this.path = path;
    this.owner = owner;
    this.createdAt = moment().format('MMMM Do YYYY, h:mm:ss a');
    this.name = name;
    fs.existsSync(this.path) ? console.log('Database exists \n') : this.init()
  }

  init() {
    // format metadata for file init
    let data = {
      owner: this.owner,
      name: this.name,
      createdAt: this.createdAt,
      collections: {}
    }
    // create and insert metadata
    fs.writeFileSync(this.path, JSON.stringify(data, null, 2))
    // log success
    console.log("\n   ================ \n Database initialized \n   ================ \n");
  }m

  createCollection(name) {
    let file = JSON.parse(fs.readFileSync(this.path))
    // console.log('file read', file)
    if (file.collections[name]) {
      return console.log('collection already exists')
    }
    file.collections[name] = {
      createdAt: moment().format('MMMM Do YYYY, h:mm:ss a'),
      documents: {}
    }
    // write to specified collection
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
    // log success and echo data inserted
    console.log("\n  ==== \n Insert \n  ==== \n");
    console.log(data)
  }

  findCollection(name) {
    let file = JSON.parse(fs.readFileSync(this.path))
    if (!file.collections[name]) {
      console.log('collection does not exist');
      return null;
    }

    return file.collections[name]
  }

  createDocument(collection, data, name) {
    let file = JSON.parse(fs.readFileSync(this.path))
    let { collections } = file
    if (!collections[collection]) {
      return console.log('collection does not exist')
    }
    // insert document into collection
    collections[collection].documents[name] = { 
      createdAt: moment().format('MMMM Do YYYY, h:mm:ss a'),
      data
    }
    // write out updated file
    fs.writeFileSync(this.path, JSON.stringify(file))
    return console.log('document created')
  }

  findDocument(name) {

  }
}


let db = new Database('Mike', 'test database name')

// db.createCollection({names: ['paul', 'george', 'graham']}, 'test collection 4')

console.log(db.findCollection('test collection 4'))

