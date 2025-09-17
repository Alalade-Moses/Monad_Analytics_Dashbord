// backend/models/Validator.js
const mongoose = require('mongoose');

const ValidatorSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  stake: {
    type: String,
    required: true
  },
  commission: {
    type: Number,
    required: true
  },
  uptime: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  blocksProposed: {
    type: Number,
    default: 0
  },
  blocksValidated: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  delegators: {
    type: Number,
    default: 0
  },
  apr: {
    type: Number,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
});

module.exports = mongoose.model('Validator', ValidatorSchema);