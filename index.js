const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

const environmentReadingRoutes = require('./routes/environmentReadingRoutes');
const alertRoutes = require('./routes/alertRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const reportRoutes = require('./routes/reportRoutes');

app.use('/api/readings', environmentReadingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/reports', reportRoutes);
app.use(express.static('backend/public'));
app.use(express.static('frontend'));

// API Routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/order-items', require('./routes/orders-items'));

app.get('/', (req, res) => {
    res.send('Study Cafe System is running!');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});