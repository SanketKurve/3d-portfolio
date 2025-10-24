const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const projectSchema = new mongoose.Schema({
  id: {
    type: String,
    default: uuidv4,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  tagline: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  longDescription: {
    type: String,
    trim: true
  },
  tech: [{
    type: String,
    trim: true
  }],
  features: [{
    type: String,
    trim: true
  }],
  demoUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  videoUrl: {
    type: String,
    trim: true
  },
  year: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    default: 'web',
    enum: ['web', 'mobile', 'ai', 'desktop', 'other']
  },
  status: {
    type: String,
    default: 'completed',
    enum: ['completed', 'in-progress', 'planned']
  },
  featured: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Update the updatedAt field before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model('Project', projectSchema);
