#!/usr/bin/env node
const { Database } = require('../Database.js')
const program = require('commander');
const fs = require('fs')
require('dotenv').config()
let db = new Database(process.env.DB_NAME, process.env.DB_OWNER, process.env.DB_PATH)


program
  .version('0.1.0')

program
  .command('createDatabase [owner] [name] [path]')
  .action((name, owner, path) => {
    db.createDatabase(name, owner, path)
  })

program
  .command('connect [path]')
  .action(path => {
    console.log(`disconnected from ${process.env.DB_OWNER}`)
  })

program
  .command('readDatabase')
  .action(() => {
    db = populate()
    console.log(db.readDatabase())
  })

program
  .command('createCollection [name]')
  .action(name => db.createCollection(name))

program
  .command('findCollection <name>')
  .action(name => console.log(db.findCollection(name)))

program
  .command('deleteCollection <name>')
  .action(name => db.updateCollection(name))

// program
//   .command('collection [name]')
//   .action(name => db.createCollection(name))

// program
//   .command('collection [name]')
//   .action(name => db.createCollection(name))

// program
//   .command('collection [name]')
//   .action(name => db.createCollection(name))

// program
//   .command('collection [name]')
//   .action(name => db.createCollection(name))

  

program.parse(process.argv);


function populate() {
    let file = JSON.parse(fs.readFileSync('./meta.json'))
    return new Database(file.name, file.owner, file.path)
}
// console.log('collection created');