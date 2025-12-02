// Reference Backend Implementation
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock Data Store would be replaced by DB
const bookings = [];

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Magnum Cars API Running' });
});

app.post('/api/bookings', (req, res) => {
  const booking = req.body;
  bookings.push(booking);
  // Here you would insert into PostgreSQL
  res.status(201).json({ message: 'Booking Created', id: booking.id });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
