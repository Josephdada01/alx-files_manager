const sha1 = require('sha1');
export const hashPassword = (password) => sha1(password);
