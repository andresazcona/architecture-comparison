const express = require('express');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || process.env.DATABASE_URL || 'mongodb://localhost:27017/products';

app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/products', productRoutes);

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to the database');
        app.listen(PORT, () => console.log('Product service is running on port ' + PORT));
    })
    .catch(err => {
        console.error('Database connection error:', err);
        process.exit(1);
    });
