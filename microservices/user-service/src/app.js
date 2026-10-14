const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/users';

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/users', userRoutes);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to the database');
        app.listen(PORT, () => console.log('User service is running on port ' + PORT));
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });
