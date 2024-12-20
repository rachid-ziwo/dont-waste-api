const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    street: String,
    city: String,
    country: String
  },
  preferences: {
    notifications: {
      type: Boolean,
      default: true
    },
    categories: [{
      type: String
    }]
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('User', userSchema);