const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = await Cart.create({ user: req.user.id, items: [] });
    const existingItem = cart.items.find(item => item.product.toString() === productId);
    if (existingItem) existingItem.quantity += quantity;
    else cart.items.push({ product: productId, quantity });
    await cart.save();
    await cart.populate('items.product');
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found' });
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
