const { MongoClient, ServerApiVersion } = require('mongodb')
const { MONGODB_URI, MONGODB_DB_NAME } = require('./config')

const client = new MongoClient(MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})
let db = null

async function connectToDatabase() {
  if (db) {
    return db
  }

  await client.connect()
  db = client.db(MONGODB_DB_NAME)
  return db
}

async function closeDatabaseConnection() {
  await client.close()
  db = null
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
}
