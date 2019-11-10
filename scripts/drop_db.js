const MongoClient = require('mongodb').MongoClient;
const dbName = 'test';
// you can put as much connection as you desire
const url = 'mongodb://localhost:27017';

const collectionToDrop = ['upload_file', 'restaurant', 'restaurantinfo']

let myDb;

async function connect() {
    if (!myDb) {
        const client = await MongoClient.connect(url);
        myDb = client.db(dbName);
    }
    return Promise.resolve(myDb);
}

function drop(db) {
    const dropPromises = collectionToDrop.map(one => db.dropCollection(one))
    return Promise.all(dropPromises)
}

module.exports = async function () {
    try {
        const db = await connect();
        console.log('start the drop');
        await drop(db);
        console.log('succeed collection dropped', collectionToDrop);
    } catch(err) {
        throw new Error(err);
    }
}