import { MongoClient } from 'mongodb'
import util from 'util'

const url = 'mongodb://localhost:27017'

const dbName = 'rsvp'

const connectToMongo = util.promisify(MongoClient.connect)

async function start() {
  try {
    const client = await connectToMongo(url)
    const db = client.db(dbName)
    console.log('it works!')
  } catch (err) {
    console.error('something went wrong', err)
  }
}

start()
