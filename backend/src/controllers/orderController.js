const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user.id });
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus: req.body.status }, { new: true });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
