const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

// All order routes require a token
router.use(verifyToken);

router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);
router.put('/:id', orderController.updateOrder);
router.get('/', orderController.getOrders);

module.exports = router;
