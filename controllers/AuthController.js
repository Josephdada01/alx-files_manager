const { hashPassword } = require('../utils/utils');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');
const { v4: uuidv4 } = require('uuid');

// the controller for the auth endpoint
class AuthController {
	static async connect(req, res) {
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
}
