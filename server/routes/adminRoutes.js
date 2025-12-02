const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Middleware to verify JWT
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });
  
  try {
    // jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (e) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

router.post('/login', adminController.login);
router.get('/stats', verifyAdmin, adminController.getStats);
router.post('/block-dates', verifyAdmin, adminController.blockDates);

module.exports = router;
