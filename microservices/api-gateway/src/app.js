const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// User service routes
app.use('/api/users', (req, res) => {
    const userServiceUrl = 'http://user-service:3001/api/users';
    axios({ method: req.method, url: userServiceUrl, data: req.body })
        .then(response => res.status(response.status).json(response.data))
        .catch(error => res.status(error.response.status).json(error.response.data));
});

// Product service routes
app.use('/api/products', (req, res) => {
    const productServiceUrl = 'http://product-service:3002/api/products';
    axios({ method: req.method, url: productServiceUrl, data: req.body })
        .then(response => res.status(response.status).json(response.data))
        .catch(error => res.status(error.response.status).json(error.response.data));
});

// Order service routes
app.use('/api/orders', (req, res) => {
    const orderServiceUrl = 'http://order-service:3003/api/orders';
    axios({ method: req.method, url: orderServiceUrl, data: req.body })
        .then(response => res.status(response.status).json(response.data))
        .catch(error => res.status(error.response.status).json(error.response.data));
});

// Start the server
app.listen(PORT, () => {
    console.log(`API Gateway is running on port ${PORT}`);
});