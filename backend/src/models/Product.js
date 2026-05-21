const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  nameAm: {
    type: String
  },
  description: {
    type: String,
    required: true
  },
  descriptionAm: String,
  price: {
    type: Number,
    required: true
  },
  originalPrice: {
    type: Number
  },
  discount: {
    type: Number,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: ''
  },
  images: [String],
  stock: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now }
  }],
  isFlashDeal: {
    type: Boolean,
    default: false
  },
  flashDealPrice: Number,
  flashDealEnd: Date,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
