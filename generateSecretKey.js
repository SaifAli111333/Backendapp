const crypto = require('crypto');

// Generate a random key
const secret = crypto.randomBytes(64).toString('hex');
console.log(secret);
