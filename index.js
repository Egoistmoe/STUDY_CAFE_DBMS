const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files (frontend pages)
app.use(express.static('frontend'));
app.use(express.static('public'));
app.use(express.static('backend/public'));

// Route files
const environmentReadingRoutes = require('./routes/environmentReadingRoutes');
const alertRoutes = require('./routes/alertRoutes');
const auditLogRoutes = require('./routes/auditLogRoutes');
const reportRoutes = require('./routes/reportRoutes');
const memberRoutes = require('./routes/memberRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const feedbackReviewRoutes = require('./routes/feedbackReviewRoutes');
const authRoutes = require('./routes/authRoutes');

// API routes
app.use('/api/readings', environmentReadingRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/audit-logs', auditLogRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/order-items', require('./routes/orders-items'));
app.use('/api/housekeeping', require('./routes/housekeepingroutes'));
app.use('/api/study-areas', require('./routes/studyAreaRoutes'));
app.use('/api/seats', require('./routes/seatRoutes'));
app.use('/api/menu-items', require('./routes/menuItemRoutes'));
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/feedback-reviews', feedbackReviewRoutes);
app.use('/roles', require('./routes/roleRoutes'));
app.use('/branches', require('./routes/branchRoutes'));
app.use('/users', require('./routes/userRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});