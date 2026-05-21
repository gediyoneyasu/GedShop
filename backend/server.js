const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGO_URI || 'mongodb+srv://gedshop_user:gedshop123@cluster0.nrzi2kp.mongodb.net/ged_shop?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ============ SCHEMAS ============
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'customer' },
  status: { type: String, default: 'Active' },
  joinDate: { type: Date, default: Date.now },
  phone: { type: String, default: '' },
  avatar: { type: String, default: '' },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  category: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  rating: { type: Number, default: 4.0 },
  stock: { type: Number, default: 0 },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now }
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String, default: '📦' },
  color: { type: String, default: '#FF6B00' },
  status: { type: String, default: 'Active' }
});

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  paymentMethod: { type: String, default: 'Cash' },
  shippingAddress: {
    street: String,
    city: String,
    phone: String
  },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);
const Order = mongoose.model('Order', orderSchema);

// ============ API ROUTES ============

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'GedShop API is running on Render!' });
});

// Products routes
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({ status: 'Active' }).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/products/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    console.log('✅ Product added:', product.name);
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Categories routes
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find({ status: 'Active' });
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get('/api/categories/all', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, categories });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/categories', async (req, res) => {
  try {
    const category = await Category.create(req.body);
    console.log('✅ Category added:', category.name);
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/categories/:id', async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, category });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Users routes
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ joinDate: -1 });
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'customer',
      status: 'Active'
    });
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    console.log('✅ New user registered:', email);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
    console.log('✅ User logged in:', email);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Orders routes
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Stats route
app.get('/api/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const orders = await Order.find();
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const activeUsers = await User.countDocuments({ status: 'Active' });
    const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });
    
    res.json({
      success: true,
      stats: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        activeUsers,
        lowStock
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ============ INITIALIZE DEFAULT DATA ============
async function initData() {
  try {
    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@gedshop.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        name: 'Super Admin',
        email: 'admin@gedshop.com',
        password: hashedPassword,
        role: 'admin',
        status: 'Active'
      });
      console.log('✅ Admin user created');
    }

    // Add default products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      await Product.create([
        { 
          name: 'Smart Watch Pro', 
          price: 99.99, 
          originalPrice: 199.99, 
          discount: 50, 
          category: 'Electronics', 
          image: 'https://images.pexels.com/photos/437037/pexels-photo-437037.jpeg?w=200', 
          description: 'Advanced smartwatch with health tracking.', 
          stock: 45,
          rating: 4.8
        },
        { 
          name: 'Wireless Headphones', 
          price: 79.99, 
          originalPrice: 159.99, 
          discount: 50, 
          category: 'Electronics', 
          image: 'https://images.pexels.com/photos/3394659/pexels-photo-3394659.jpeg?w=200', 
          description: 'Noise-cancelling wireless headphones.', 
          stock: 32,
          rating: 4.7
        },
        { 
          name: 'Running Shoes', 
          price: 59.99, 
          originalPrice: 119.99, 
          discount: 50, 
          category: 'Fashion', 
          image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?w=200', 
          description: 'Comfortable running shoes with breathable mesh.', 
          stock: 28,
          rating: 4.6
        }
      ]);
      console.log('✅ Default products added');
    }

    // Add default categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.create([
        { name: 'Electronics', icon: '📱', color: '#FF6B00' },
        { name: 'Fashion', icon: '👕', color: '#E74C3C' },
        { name: 'Accessories', icon: '⌚', color: '#3498DB' }
      ]);
      console.log('✅ Default categories added');
    }
  } catch (error) {
    console.error('Init error:', error);
  }
}

// ============ START SERVER ============
initData().then(() => {
  const PORT = process.env.PORT || 10000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n========================================`);
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    console.log(`✅ MongoDB Connected`);
    console.log(`📝 Admin: admin@gedshop.com / admin123`);
    console.log(`========================================\n`);
  });
});
