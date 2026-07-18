const mongoose = require('mongoose');

// Define the login log schema
const loginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  loginTime: {
    type: Date,
    default: Date.now
  },
  logoutTime: {
    type: Date,
    default: null
  },
  ipAddress: {
    type: String,
    default: 'Unknown'
  },
  userAgent: {
    type: String,
    default: 'Unknown'
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    required: true
  },
  failureReason: {
    type: String,
    default: null // null if login was successful
  },
  sessionDuration: {
    type: Number,
    default: null // in seconds
  }
});

// Calculate session duration before saving logout
loginLogSchema.pre('save', function(next) {
  if (this.loginTime && this.logoutTime) {
    this.sessionDuration = Math.floor((this.logoutTime - this.loginTime) / 1000);
  }
  next();
});

// Create and export the LoginLog model
const LoginLog = mongoose.model('LoginLog', loginLogSchema);

module.exports = LoginLog;
