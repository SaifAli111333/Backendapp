const jwt = require('jsonwebtoken');
const blacklist = new Set();

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (token == null) {
    return res.status(401).json({ message: 'Token is required' }); 
  }
  if (blacklist.has(token)) {
    return res.status(403).json({ message: 'Token has been invalidated' });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' }); 
    }

    req.user = user; 
    next();
  });
};

module.exports = authenticateToken;
