const jwt = require('jsonwebtoken');



const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  jwt.verify(token, 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    req.adminId = decoded.adminId; // Assuming the JWT contains adminId
    next();
  });
};




module.exports = authMiddleware;
