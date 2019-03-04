const fs = require('fs');
const moment = require('moment');


class Database {

  constructor(owner, name, path = './database.json') {
    this.path = path;
    this.owner = owner;
    this.created_at = moment().format('MMMM Do YYYY, h:mm:ss a');
    this.name = name;
    this.collection_count = 0;
    fs.existsSync(path) ? this.populate() : this.init();
  }

  init() {
    // format metadata for file init
    let data = {
      owner: this.owner,
      name: this.name,
      created_at: this.created_at,
      collection_count: this.collection_count,
      collections: {}
    }
    // create and insert metadata
    fs.writeFileSync(this.path, JSON.stringify(data, null, 2))
    // log success
    console.log(`\n ======= \n "${this.name || "Unnamed Database"}" initialized \n`);
  }

  populate() {
    let file = JSON.parse(fs.readFileSync(this.path));
    console.log(`\n ======= \n Connected to "${file.name || 'Unnamed Database'}"`);
    this.owner = file.owner;
    this.created_at = file.created_at;
    this.name = file.name;
    this.collection_count = file.collection_count;
  }

  createCollection(name = this.assignName('collection')) {
    let file = JSON.parse(fs.readFileSync(this.path))
    // console.log('file read', file)
    if (file.collections[name]) {
      return console.log(`\n ******* \n "${name}" already exists \n`)
    }
    file.collections[name] = {
      created_at: moment().format('MMMM Do YYYY, h:mm:ss a'),
      document_count: 0,
      documents: {}
    }
    // update counter
    file.collection_count++
    // write to specified collection
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
    // log success and echo data inserted
    console.log(`\n ======= \n ${name} Created \n`);
  }

  findCollection(name) {
    let file = JSON.parse(fs.readFileSync(this.path))
    if (!file.collections[name]) {
      console.log(`\n ******** \n "${name}" does not exist \n`);
      return null;
    }

    return file.collections[name]
  }

  createDocument(collection, document, name = this.assignName('document', collection)) {
    let file = JSON.parse(fs.readFileSync(this.path))
    let { collections } = file
    if (!collections[collection]) {
      return console.log(`\n ******* \n "${collection}" does not exist \n`)
    }
    // check if document exists
    if (collections[collection].documents[name]) {
      return console.log(`\n ******* \n "${name}" already exists \n`)
    }
    // calc item count in document
    let item_count = Object.keys(document).length
    // insert document into collection
    collections[collection].documents[name] = { 
      created_at: moment().format('MMMM Do YYYY, h:mm:ss a'),
      item_count,
      items: document
    }
    // increment doc count
    collections[collection].document_count++
    // write out updated file
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
    return console.log(`\n ======= \n ${name} created \n`)
  }

  findDocument(name) {

  }

  assignName(type, collection) {
    if (type === 'collection') {
      return `${type}_${this.collection_count}`
    }
    if (type === 'document') {
      let file = JSON.parse(fs.readFileSync(this.path))
      let { document_count } = file.collections[collection]
      return `${type}_${document_count + 1}`
    }
  }

}

module.exports = {
  Database
}