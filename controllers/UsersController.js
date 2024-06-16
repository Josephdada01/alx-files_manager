// const crypto = require('crypto');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

// Function to hash the password using SHA1
// function hashPassword(password) {
// return crypto.createHash('sha1').update(password).digest('hex');
// }

// The controller for the users endpoint
class UsersController {
  // this create a new user
  static async postNew(req, res) {
    const { email, password } = req.body;

    // Checking if email and password are provided
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }
    const existingUser = await dbClient.userExist(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }
    const user = await dbClient.createUser(email, password);
    const id = `${user.insertedId}`;
    return res.status(201).json({ id, email });
  }
  // GET /users/me should retrieve the user base on the token used:
  static async getUserByToken(req, res) {
    const token = req.headers['x-token'];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const key = `auth_${token}`;
    try {
      const userId = await redisClient.get(key);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const user = await dbClient.getUserById(userId);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // now return the user object with email and id only
      return res.status(200).json({ id: user._id, email: user.email });
    } catch (error) {
      console.error('Error retrieving user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
module.exports = UsersController;
