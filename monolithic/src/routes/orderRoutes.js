const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Route to create a new order
router.post('/', orderController.createOrder);

// Route to get a specific order by ID
router.get('/:id', orderController.getOrder);

// Route to update an existing order
router.put('/:id', orderController.updateOrder);

// Route to get all orders
router.get('/', orderController.getOrders);

module.exports = router;