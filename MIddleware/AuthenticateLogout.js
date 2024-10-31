
const blacklist = new Set();
const logout = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    blacklist.add(token); 
    return res.status(200).json({ message: 'Logged out successfully' });
  }

  return res.status(400).json({ message: 'Token is required for logout' });
};

module.exports = { logout, blacklist };
