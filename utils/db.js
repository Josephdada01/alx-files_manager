// create a file db.js that contains the class DBClient.
const { MongoClient } = require('mongodb');

// DBClient should have:
// the constructor that creates a client to MongoDB:
// host: from the environment variable DB_HOST or default: localhost
// port: from the environment variable DB_PORT or default: 27017
// database: from the environment variable DB_DATABASE or default: files_manager

class DBClient {
    constructor() {
        const host = process.env.DB_HOST || 'localhost';
        const port = process.env.DB_PORT || '27017';
        const database = process.env.DB_DATABASE || 'files_manager';

        const url = 'mongodb://${host}/${database}';

        this.client = new MongoClient(url, {userNewUrlParser: true, userUnifiedTopology: true});
        this.connection = null;

        this.connect();
    }
    async connect() {
        try {
            await this.client.connect();
            console.log('Connected to MongoDB');
            this.connection = this.client.db();
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }
    // a function isAlive that returns true when the connection to
    // MongoDB is a success otherwise, false
    async isAlive() {
        try {
            // check if client is connected
            await this.client.db().admin().ping();
            return true;
        } catch (error) {
            console.error('MongoDB connection is  not alive:', error);
            return false;
        }
    }
    // an asynchronous function nbUsers that returns the number of
    // documents in the collection users
    async nbUsers() {
        try {
            const usersCollection = this.connection.collection('users');
            const count = await usersCollection.countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting users:', error);
            return -1;
        }
    }
    // an asynchronous function nbFiles that returns
    // the number of documents in the collection files
    async nbFiles() {
        try {
            const filesCollection = this.connection.collection('files');
            const count = await filesCollection.countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting files:', error);
            return -1;
        }
    }
    async disconnect() {
        try {
            await this.client.close();
            console.log('Disconnected from MongoDB');
        } catch (error) {
            console.error('Error disconnecting from MongoDB:', error);
            throw error;
        }
    }
}
// creating and exporting an instance of DBClient
const dbClient = new DBClient();
module.exports = dbClient