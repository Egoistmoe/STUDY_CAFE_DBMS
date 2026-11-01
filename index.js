const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Study Cafe System is running!');
});

// Member B 
app.use('/api/study-areas', require('./routes/studyAreaRoutes'));
app.use('/api/seats', require('./routes/seatRoutes'));
app.use('/api/menu-items', require('./routes/menuItemRoutes'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});