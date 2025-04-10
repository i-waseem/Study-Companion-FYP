const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    console.log('=== Auth Middleware Start ===');
    console.log('Request URL:', req.url);
    console.log('Request Method:', req.method);
    console.log('Request Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Request Cookies:', JSON.stringify(req.cookies, null, 2));
    
    // Get token from cookie
    const token = req.cookies.token;
    console.log('Cookies received:', req.cookies);
    console.log('Token found:', token);
    
    if (!token) {
      console.log('No token found in cookies');
      console.log('=== Auth Middleware End ===');
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Token verified successfully:', decoded);
    
    // Add user info to request
    req.user = {
      _id: decoded.userId, // Changed from userId to _id to match what the feedback route expects
      userId: decoded.userId
    };
    
    console.log('User authenticated:', req.user);
    console.log('=== Auth Middleware End ===');
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    console.log('=== Auth Middleware End (Error) ===');
    
    // Clear invalid token
    res.clearCookie('token', {
      httpOnly: true,
      secure: false, // Set to true in production
      sameSite: 'lax',
      path: '/'
    });
    res.status(401).json({ message: 'Session expired, please login again' });
  }
};
