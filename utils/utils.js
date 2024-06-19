#!/usr/bin/node
const Redis = require('ioredis');

class RedisClient {
  constructor() {
    this.client = new Redis();
    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  async isAlive() {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  async get(key) {
    try {
      return await this.client.get(key); // Ensure it returns a string
    } catch (error) {
      console.error('Error getting value:', error);
      return null;
    }
  }

  async set(key, value, duration) {
    try {
      await this.client.set(key, value, 'EX', duration);
    } catch (error) {
      console.error('Error setting value:', error);
      throw error;
    }
  }

  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Error deleting key:', error);
      throw error;
    }
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
