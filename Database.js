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
    file.collection_count++
    // write to specified collection
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
    // log success and echo data inserted
    return console.log(`\n ======= \n ${name} Created \n`);
  }

  findCollection(name) {
    if (!this.checkCollectionExists(name)) {
      return console.log(`\n ******** \n "${name}" does not exist \n`);
    }

    let file = this.readFile();
    return file.collections[name];
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

  deleteCollection(name) {
    if (!this.checkCollectionExists(name)) {
      return console.log(`\n ******** \n "${name}" does not exist \n`);
    }
    let file = this.readFile();
    delete file.collections[name];
    file.collection_count--
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2));
    return console.log(`\n ======= \n ${name} Deleted \n`);
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
    collections[collection].document_count++;
    // write out updated file
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2));
    return console.log(`\n ======= \n ${name} created \n`);
  }

  findDocument(collection, name) {
    let file = JSON.parse(fs.readFileSync(this.path))
    if (this.checkCollectionExists(collection)) {
      return file.collections[collection].documents[name] || console.log(`\n ******* \n ${name} does not exist \n`)
    } else {
      return console.log(`\n ******* \n "${collection}" does not exist \n`)
    }
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

  checkCollectionExists(name) {
    let file = JSON.parse(fs.readFileSync(this.path))
    return file.collections[name] ? true : false;
  }

  checkDocumentExists(collection, name) {
    let file = JSON.parse(fs.readFileSync(this.path))
    return file.collections[collection].documents[name] ? true : false;
  }
}

module.exports = {
  Database
}