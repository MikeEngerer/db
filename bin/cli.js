#!/usr/bin/env node
const { Database } = require('../Database.js')
const program = require('commander');
const fs = require('fs')

let db;

program
  .version('0.1.0')

program
  .command('createDatabase [owner] [name] [path]')
  .action((name, owner, path) => {
    db = new Database(owner, name, path)
    data = {
      owner,
      name,
      path
    }
    fs.writeFileSync('./meta.json', JSON.stringify(data))
  })

program
  .command('connect [path]')
  .action(path => {
    db = new Database(path)
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
    return new Database(file.path)
}
// console.log('collection created');