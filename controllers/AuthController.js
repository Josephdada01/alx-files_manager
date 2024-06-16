const { hashPassword } = require('../utils/utils');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { v4: uuidv4 } = require('uuid');

// the controller for the auth endpoint
class AuthController {
	static async getConnect(req, res) {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Basic ')) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		const base64Credentials = authHeader.split(' ')[1];
		const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
		const [email, password] = credentials.split(':');
		// If user do not input password or email return unaythorized

		if (!email || !password) {
			return res.status(401).json({ error: 'Unauthorized' });
		}
		const hashedPassword = hashPassword(password);

		const user = await dbClient.getUser('email');
		if (!user) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const token = uuidv4();

		// storing the authe token in redis for 24 hours expiration
		const key = `auth_${token}`;
		await redisClient.set(key, user._id.toString(), 86400);

		// returning the token to the client
		return res.status(200).json({ token });
	}
	// function that logout user based on token
	static async getDisonnect(req, res){
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
			await redisClient.del(key);
			return res.status(204).send();
		} catch (error) {
			console.error('Error disconnecting user:', error);
			return res.status(500).json({ error: 'Internal server error' });
		}
	}
}
module.exports = AuthController;
