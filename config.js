require('dotenv').config()

module.exports = {
  DB_NAME: process.env.DB_NAME,
  DB_OWNER: process.env.DB_OWNER,
  DB_PATH: process.env.DB_PATH
}