// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    name: { type: String, required: true },
    id: { type: String, required: true }
  },
  items: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true }
  }],
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'ready', 'completed', 'cancelled'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: true
  },
  pickupTime: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Order', orderSchema);