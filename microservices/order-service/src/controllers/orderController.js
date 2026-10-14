const Order = require('../models/orderModel');

// Create a new order for the authenticated user
exports.createOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const order = await new Order({ productId, quantity, userId: req.user.id }).save();
        res.status(201).json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a specific order of the authenticated user
exports.getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, userId: req.user.id });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an existing order of the authenticated user
exports.updateOrder = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, userId: req.user.id },
            { productId, quantity },
            { new: true, runValidators: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all orders of the authenticated user
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
