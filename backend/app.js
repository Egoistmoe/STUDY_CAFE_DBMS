
const express = require('express');
const app = express();

const usersRoutes = require('./routes/users');
const rolesRoutes = require('./routes/roles');
const branchesRoutes = require('./routes/branches');

app.use(express.json());

app.use('/users', usersRoutes);
app.use('/roles', rolesRoutes);
app.use('/branches', branchesRoutes);

app.get('/', (req, res) => {
    res.send('Study Cafe API is running!');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        message: 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
