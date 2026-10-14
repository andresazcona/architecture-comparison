const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middleware/auth');

// Reading the catalog is public; changing it requires a token
router.get('/', productController.getProducts);
router.post('/', verifyToken, productController.addProduct);
router.put('/:id', verifyToken, productController.updateProduct);
router.delete('/:id', verifyToken, productController.deleteProduct);

module.exports = router;
