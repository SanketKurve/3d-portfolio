const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const skillSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Programming', 'Frontend', 'Backend', 'Database', 'Tools', 'Other']
  },
  level: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  icon: {
    type: String,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    min: 0
  },
  projects: [{
    type: String,
    trim: true
  }],
  order: {
    type: Number,
    default: 0
  },
  visible: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

module.exports = mongoose.model('Skill', skillSchema);
