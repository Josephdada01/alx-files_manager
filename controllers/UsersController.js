// const crypto = require('crypto');
const dbClient = require('../utils/db');

// Function to hash the password using SHA1
// function hashPassword(password) {
// return crypto.createHash('sha1').update(password).digest('hex');
// }

// The controller for the users endpoint
class UsersController {
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
}
module.exports = UsersController;
