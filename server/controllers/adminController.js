// Reference Backend Controller (Node.js)
// This file demonstrates how the logic would look in a pure Express backend
// Currently, the React app uses Supabase directly via src/services/api.ts

const jwt = require('jsonwebtoken');
const { pool } = require('../db'); // Assumes pg pool setup

const ADMIN_EMAIL = 'carsmagnum583@gmail.com';
const ADMIN_PASS = 'Magnum@123';
const JWT_SECRET = process.env.JWT_SECRET || 'magnum_secret_key';

exports.login = async (req, res) => {
  const { email, password } = req.body;
  
  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    const token = jwt.sign({ role: 'admin', email }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
};

exports.getStats = async (req, res) => {
  try {
    const bookings = await pool.query('SELECT COUNT(*) FROM bookings');
    const revenue = await pool.query("SELECT SUM(total_amount) FROM bookings WHERE status = 'Completed'");
    res.json({
      totalBookings: bookings.rows[0].count,
      revenue: revenue.rows[0].sum
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.blockDates = async (req, res) => {
  const { carId, startDate, endDate } = req.body;
  try {
    // Create a 'Maintenance' booking
    await pool.query(
      "INSERT INTO bookings (car_id, start_date, end_date, status, customer_name) VALUES ($1, $2, $3, 'Maintenance', 'Admin Block')",
      [carId, startDate, endDate]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
