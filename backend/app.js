
const express = require('express');
const path = require('path');
const app = express();

// Load environment variables
require('dotenv').config();

// Import API routes
const usersRoutes = require('./routes/users');
const rolesRoutes = require('./routes/roles');
const branchesRoutes = require('./routes/branches');
const authRoutes = require('./routes/auth');

// Middleware
app.use(express.json());

// Serve frontend files (HTML, CSS, JavaScript)
app.use(express.static(path.join(__dirname, '../frontend')));

// API routes
app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/branches', branchesRoutes);
app.use('/auth', authRoutes);

// API status
app.get('/api/status', (req, res) => {
    res.send('Study Cafe API is running!');
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        message: 'Internal Server Error'
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
