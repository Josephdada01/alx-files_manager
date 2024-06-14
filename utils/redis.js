#!/usr/bin/node
// Inside the folder utils, create a file redis.js that contains the class RedisClient.
// RedisClient should have:
// the constructor that creates a client to Redis:
// any error of the redis client must be displayed in the console
// a function isAlive that returns true when the connection to Redis is a success otherwise, false

const Redis = require('ioredis');

class RedisClient {
  constructor() {
    // this create the Redis client
    this.client = new Redis();

    // handle connection error
    this.client.on('error', (err) => {
      console.error('Redis error:', err);
    });
  }

  // a function isAlive that returns true when the
  // connection to Redis is a success otherwise, false
  async isAlive() {
    try {
      await this.client.ping();
      return true;
    } catch (error) {
      console.error('Connection check failed:', error);
      return false;
    }
  }

  // an asynchronous function get that takes a string key
  // as argument and returns the Redis value stored for this key
  async get(key) {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error('Error getting value:', error);
      return null;
    }
  }

  // an asynchronous function set that takes a string key, a value and a duration in second as
  // arguments to store it in Redis (with an expiration set by the duration argument)
  async set(key, value, duration) {
    try {
      await this.client.set(key, value, 'EX', duration);
    } catch (error) {
      console.error('Error setting value:', error);
      throw error; // Optionally, throw the error to propagate it
    }
  }

  // an asynchronous function del that takes a string key as argument and
  // remove the value in Redis for this key
  async del(key) {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Error deleting key:', error);
      throw error;
    }
  }
}
// After the class definition, create and export an instance of RedisClient called redisClient.
const redisClient = new RedisClient();
module.exports = redisClient;
