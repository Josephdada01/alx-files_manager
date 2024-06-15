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

    async nbUsers() {
        try {
            if (!this.connection) {
                throw new Error("No database connection");
            }
            const usersCollection = this.connection.collection('users');
            const count = await usersCollection.countDocuments();
            return count;
        } catch (error) {
            console.error('Error counting users:', error);
            return -1;
        }
    }

    async nbFiles() {
        try {
            if (!this.connection) {
                throw new Error("No database connection");
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

const dbClient = new DBClient();
module.exports = dbClient;
