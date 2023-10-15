import jwt from 'jsonwebtoken';

const checkAuth = (req, res, next) => {
  const jwtSecret = process.env.JWT_SECRET;
  const authHeader = req.header('Authorization');
  
  if (!authHeader) {
    return res.status(401).json({ message: 'Access denied. Invalid or missing token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

export { checkAuth };
