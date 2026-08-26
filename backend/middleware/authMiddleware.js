const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  //look for the Authorization header
  const authHeader = req.headers.authorization;

  // reject if missing or wrong format
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // pull out just the token itself
  
  const token = authHeader.split(' ')[1];

  try {
    // verify the token is real and not expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach the user's ID so the next code knows who's asking
    req.userId = decoded.userId;
    next(); // let the request continue to the actual route
  } catch (error) {
    // token was invalid or expited
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;