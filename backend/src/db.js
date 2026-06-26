const { MongoClient, ServerApiVersion } = require('mongodb')
const { MONGODB_URI, MONGODB_DB_NAME } = require('./config')

let client = null
let db = null

async function connectToDatabase() {
  if (db) {
    return db
  }

  if (!client) {
    client = new MongoClient(MONGODB_URI, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    })
  }

  await client.connect()
  db = client.db(MONGODB_DB_NAME)
  return db
}

async function closeDatabaseConnection() {
  if (client) {
    await client.close()
    client = null
    db = null
  }
}

module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
}
