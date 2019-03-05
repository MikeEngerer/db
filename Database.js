const fs = require('fs');
const moment = require('moment');


class Database {

  constructor(owner, name, path = './database.json') {
    this.owner = owner;
    this.name = name;
    this.path = path;
    fs.existsSync(path) ? this.populate() : this.init();
  }

  // called on new Database instance 
  init() {
    // format metadata for file init
    let data = {
      owner: this.owner,
      name: this.name,
      created_at: moment().format('MMMM Do YYYY, h:mm:ss a'),
      collection_count: 0,
      collections: {}
    }
    // create and insert metadata
    fs.writeFileSync(this.path, JSON.stringify(data, null, 2))
    // log success
    console.log(`\n ======= \n "${this.name || "Unnamed Database"}" initialized \n`);
  }

  // called when path given is an existing db
  populate() {
    let file = this.readFile();
    this.owner = file.owner || 'N/A';
    this.name = file.name || 'N/A';
    console.log(`\n ======= \n Connected to "${file.name || 'N/A'}"`);
  }
  // returns entire db object
  readDatabase() {
    return this.readFile();
  }
  // deletes db 
  deleteDatabase() {
    fs.unlinkSync(this.path)
    return console.log(`\n ======= \n ${this.name} deleted \n`);
  }
  // creates collection from given name || assign name from coll_count
  createCollection(name = this.assignName('collection')) {
    // exits if coll exists
    if (this.checkCollectionExists(name)) {
      return console.log(`\n ******* \n "${name}" already exists \n`);
    }
    // insert collection obj into db
    let file = this.readFile();
    file.collections[name] = {
      created_at: moment().format('MMMM Do YYYY, h:mm:ss a'),
      document_count: 0,
      documents: {}
    }
    this.writeFile(file)
    this.updateCollectionCount();
    // log success 
    return console.log(`\n ======= \n ${name} Created \n`);
  }
  // if no arg given, returns list of colls in db, otherwise returns coll
  findCollection(collection) {
    let file = this.readFile();
    if (!this.checkCollectionExists(collection)) {
      return console.log(`\n ******** \n ${collection ? (collection + " does not exist") : 'Specify collection as argument'} \n`, 
        'Existing collections: \n', 
        this.listCollections());
    }

    return file.collections[collection];
  }
  // checks if coll/coll new name is exists, renames coll if not
  updateCollectionName(name, newName) {
    if (!this.checkCollectionExists(name)) {
      return console.log(`\n ******** \n "${name}" does not exist \n`);
    } else if (this.checkCollectionExists(newName)) {
      return console.log(`\n ******* \n "${newName}" already exists \n`);
    }

    let file = this.readFile();
    file.collections[newName] = file.collections[name];
    delete file.collections[name];

    this.writeFile(file)
    return console.log(`\n ======= \n ${name} changed to ${newName} \n`);
  }
  // check coll exists, del coll
  deleteCollection(collection) {
    if (!this.checkCollectionExists(collection)) {
      return console.log(`\n ******** \n "${collection}" does not exist \n`);
    }
    let file = this.readFile();
    delete file.collections[collection];
    this.writeFile(file);
    this.updateCollectionCount();
    return console.log(`\n ======= \n ${collection} Deleted \n`);
  }
  // takes coll name and document data, inserts as specified name or generated name from doc_count
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
    this.writeFile(file);
    this.updateDocumentCount(collection);
    return console.log(`\n ======= \n ${name} created \n`);
  }
  // returns doc obj from given coll and doc name
  findDocument(collection, document) {
    let file = JSON.parse(fs.readFileSync(this.path))
    if (this.checkCollectionExists(collection)) {
      return file.collections[collection].documents[document] || console.log(`\n ******* \n ${document} does not exist \n`)
    } else {
      return console.log(`\n ******* \n "${collection}" does not exist \n`)
    }
  }
  // merge given data with existing doc
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

    this.writeFile(file)
    return console.log(`\n ======= \n ${document} updated \n`);
  }
  // del given doc in given coll
  deleteDocument(collection, document) {
    if (!this.checkCollectionExists(collection)) {
      return console.log(`\n ******** \n "${collection}" does not exist \n`);
    } else if (!this.checkDocumentExists(collection, document)) {
      return console.log(`\n ******* \n ${document} does not exist \n`)
    }

    let file = this.readFile();
    delete file.collections[collection].documents[document]

    this.writeFile(file)
    this.updateDocumentCount(collection);
    return console.log(`\n ======= \n ${document} deleted \n`);
  }
  // generate coll or doc name from their respective counts
  assignName(type, collection) {
    let file = this.readFile();
    if (type === 'collection') {
      return `${type}_${file.collection_count}`
    }
    if (type === 'document') {
      let { document_count } = file.collections[collection]
      return `${type}_${document_count + 1}`
    }
  }
  // return whole db 
  readFile() {
    return JSON.parse(fs.readFileSync(this.path));
  }
  // write to db file
  writeFile(file) {
    fs.writeFileSync(this.path, JSON.stringify(file, null, 2))
  }
  // returns bool 
  checkCollectionExists(collection) {
    let file = this.readFile();
    return file.collections[collection] ? true : false;
  }
  // returns bool
  checkDocumentExists(collection, document) {
    let file = this.readFile();
    return file.collections[collection].documents[document] ? true : false;
  }
  // gets length of colls and write to db
  updateCollectionCount() {
    let file = this.readFile();
    file.collection_count = Object.keys(file.collections).length;
    this.writeFile(file)
  }
  // gets length of docs in coll and write to db
  updateDocumentCount(collection) {
    let file = this.readFile();
    file.collections[collection].document_count = Object.keys(file.collections[collection].documents).length;
    this.writeFile(file)
  }
  // gets length of items in doc and write to db
  updateItemCount(collection, document) {
    let file = this.readFile();
    let items = file.collections[collection].documents[document];
    file.collections[collection].documents[document].item_count = Object.keys(items).length;
    this.writeFile(file)
  }
  // returns list of coll names
  listCollections() {
    let file = this.readFile();
    return Object.keys(file.collections)
  }
}

module.exports = {
  Database
}