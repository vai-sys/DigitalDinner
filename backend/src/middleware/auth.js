
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/db');

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
   
    token = req.headers.authorization.split(' ')[1];
  }

  
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }

  try {
 
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

   
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id
      },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User no longer exists'
      });
    }

   
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route'
    });
  }
};