const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
// GET /users/me should retrieve the user base on the token used:
class UserController {
    static async getMe(req, res) {
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
module.exports = UserController;