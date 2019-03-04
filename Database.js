const fs = require('fs');
const moment = require('moment');


class Database {

  constructor(owner, name, path = './database.json') {
    this.owner = owner;
    this.name = name;
    this.path = path;
    this.created_at = moment().format('MMMM Do YYYY, h:mm:ss a');
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
    let file = this.readFile();
    console.log(`\n ======= \n Connected to "${file.name || 'Unnamed Database'}"`);
    this.owner = file.owner;
    this.created_at = file.created_at;
    this.name = file.name;
    this.collection_count = file.collection_count;
  }

  createCollection(name = this.assignName('collection')) {
    if (this.checkCollectionExists(name)) {
      return console.log(`\n ******* \n "${name}" already exists \n`);
    }

    let file = this.readFile();
    file.collections[name] = {
      created_at: moment().format('MMMM Do YYYY, h:mm:ss a'),
      document_count: 0,
      documents: {}
    }
    // update counter
    // write to specified collection
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
    this.updateCollectionCount();
    // log success and echo data inserted
    return console.log(`\n ======= \n ${name} Created \n`);
  }

  findCollection(collection) {
    if (!this.checkCollectionExists(collection)) {
      return console.log(`\n ******** \n "${collection}" does not exist \n`);
    }

    let file = this.readFile();
    return file.collections[collection];
  }

  updateCollectionName(name, newName) {
    if (!this.checkCollectionExists(name)) {
      return console.log(`\n ******** \n "${name}" does not exist \n`);
    } else if (this.checkCollectionExists(newName)) {
      return console.log(`\n ******* \n "${newName}" already exists \n`);
    }

    let file = this.readFile();
    file.collections[newName] = file.collections[name];
    delete file.collections[name];

    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
    return console.log(`\n ======= \n ${name} changed to ${newName} \n`);
  }

  deleteCollection(collection) {
    if (!this.checkCollectionExists(collection)) {
      return console.log(`\n ******** \n "${collection}" does not exist \n`);
    }
    let file = this.readFile();
    delete file.collections[collection];
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2));
    this.updateCollectionCount();
    return console.log(`\n ======= \n ${collection} Deleted \n`);
  }

  createDocument(collection, document, name = this.assignName('document', collection)) {
    let file = this.readFile();
    let { collections } = file;
    if (!this.checkCollectionExists(collection)) {
      return console.log(`\n ******* \n "${collection}" does not exist \n`);
    }
    // check if document exists
    if (this.checkDocumentExists(collection, name)) {
      return console.log(`\n ******* \n "${name}" already exists \n`);
    }
    // calc item count in document
    let item_count = Object.keys(document).length;
    // insert document into collection
    collections[collection].documents[name] = { 
      created_at: moment().format('MMMM Do YYYY, h:mm:ss a'),
      item_count,
      items: document
    }
    // increment doc count
    // write out updated file
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2));
    this.updateDocumentCount(collection);
    return console.log(`\n ======= \n ${name} created \n`);
  }

  findDocument(collection, document) {
    let file = JSON.parse(fs.readFileSync(this.path))
    if (this.checkCollectionExists(collection)) {
      return file.collections[collection].documents[document] || console.log(`\n ******* \n ${document} does not exist \n`)
    } else {
      return console.log(`\n ******* \n "${collection}" does not exist \n`)
    }
  }

  updateDocument(collection, document, data) {
    if (!this.checkCollectionExists(collection)) {
      return console.log(`\n ******** \n "${collection}" does not exist \n`);
    } else if (!this.checkDocumentExists(collection, document)) {
      return console.log(`\n ******* \n ${document} does not exist \n`)
    }

    let file = this.readFile();
    let { items } = file.collections[collection].documents[document];
    Object.assign(items, data);
    file.collections[collection].documents[document].item_count = Object.keys(items).length;

    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
    return console.log(`\n ======= \n ${document} updated \n`);
  }

  deleteDocument(collection, document) {
    if (!this.checkCollectionExists(collection)) {
      return console.log(`\n ******** \n "${collection}" does not exist \n`);
    } else if (!this.checkDocumentExists(collection, document)) {
      return console.log(`\n ******* \n ${document} does not exist \n`)
    }

    let file = this.readFile();
    delete file.collections[collection].documents[document]

    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
    this.updateDocumentCount(collection);
    return console.log(`\n ======= \n ${document} deleted \n`);
  }

  assignName(type, collection) {
    if (type === 'collection') {
      return `${type}_${this.collection_count}`
    }
    if (type === 'document') {
      let file = this.readFile();
      let { document_count } = file.collections[collection]
      return `${type}_${document_count + 1}`
    }
  }

  readFile() {
    return JSON.parse(fs.readFileSync(this.path))
  }

  checkCollectionExists(collection) {
    let file = JSON.parse(fs.readFileSync(this.path))
    return file.collections[collection] ? true : false;
  }

  checkDocumentExists(collection, document) {
    let file = this.readFile();
    return file.collections[collection].documents[document] ? true : false;
  }

  updateCollectionCount() {
    let file = this.readFile();
    file.collection_count = Object.keys(file.collections).length;
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
  }

  updateDocumentCount(collection) {
    let file = this.readFile();
    file.collections[collection].document_count = Object.keys(file.collections[collection].documents).length;
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
  }

  updateItemCount(collection, document) {
    let file = this.readFile();
    let items = file.collections[collection].documents[document];
    file.collections[collection].documents[document].item_count = Object.keys(items).length;
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
  }
}

module.exports = {
  Database
}