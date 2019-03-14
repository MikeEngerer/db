#!/usr/bin/env node
const { Database } = require('../Database.js')
const program = require('commander');
const fs = require('fs')
const config = require('../config.js')
const meta = fs.existsSync('./meta.json') ? JSON.parse(fs.readFileSync('./meta.json')) : false


let db = meta ? new Database(meta.DB_NAME, meta.DB_OWNER, meta.DB_PATH) : new Database(config.DB_NAME, config.DB_OWNER, config.DB_PATH) 


program
  .version('0.1.0')

program
  .command('createDatabase [owner] [name] [path]')
  .action((name, owner, path) => {
    db.createDatabase(name, owner, path)
  })

program
  .command('connect <path>')
  .action(path => {
    let current = new Database(undefined, undefined, path)
    let data = {
      DB_NAME: current.name,
      DB_OWNER: current.owner,
      DB_PATH: current.path
    }
    console.log(`disconnected from ${config.DB_OWNER}`)
    fs.writeFileSync('meta.json', JSON.stringify(data, null, 2))
  })

program
  .command('readDatabase')
  .action(() => {
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