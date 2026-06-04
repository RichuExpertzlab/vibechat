const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify JWT from cookie
const protect = async (req, res, next) => {
  try {
    let token;

    // Check if token exists in cookies
    if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized - No token"
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from database (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({
      success: false,
      message: "Not authorized - Invalid token"
    });
  }
};

module.exports = { protect };