// DBClient should have:
// the constructor that creates a client to MongoDB:
// host: from the environment variable DB_HOST or default: localhost
// port: from the environment variable DB_PORT or default: 27017
// database: from the environment variable DB_DATABASE or default: files_manager
const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';

    // Correct the URL format
    const url = `mongodb://${host}:${port}/${database}`;

    // Correct options
    this.client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
    this.connection = null;

    this.connect();
  }

  async connect() {
    try {
      // Try to establish the connection
      await this.client.connect();
      console.log('Connected to MongoDB');
      this.connection = this.client.db(); // Select the database
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      this.connection = null;
    }
  }

  // a function isAlive that returns true when the connection to MongoDB is success otherwise,false
  async isAlive() {
    try {
      // Check if client is connected and database is accessible
      if (!this.connection) {
        await this.connect();
      }
      await this.connection.admin().ping();
      return true;
    } catch (error) {
      console.error('MongoDB connection is not alive:', error);
      return false;
    }
  }

  // an asynchronous function nbUsers that returns the number of documents in the collection users
  async nbUsers() {
    try {
      if (!this.connection) {
        throw new Error('No database connection');
      }
      const usersCollection = this.connection.collection('users');
      const count = await usersCollection.countDocuments();
      return count;
    } catch (error) {
      console.error('Error counting users:', error);
      return -1;
    }
  }

  // an asynchronous function nbFiles that returns the number of documents in the collection files
  async nbFiles() {
    try {
      if (!this.connection) {
        throw new Error('No database connection');
      }
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
      if (this.client) {
        await this.client.close();
        console.log('Disconnected from MongoDB');
      }
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}
// After the class definition, create and export an instance of DBClient called dbClient.
const dbClient = new DBClient();
module.exports = dbClient;
