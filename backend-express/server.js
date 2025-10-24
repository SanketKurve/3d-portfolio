const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

// Import models and routes
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Certificate = require('./models/Certificate');
const Message = require('./models/Message');
const AdminUser = require('./models/AdminUser');

const app = express();
const PORT = process.env.PORT || 8001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['*'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/portfolio_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully!'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Import auth middleware
const { authenticateToken, generateToken } = require('./middleware/auth');

// ===== PUBLIC ROUTES =====

// Health check
app.get('/', (req, res) => {
  res.json({
    message: "Portfolio API is running",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date().toISOString()
  });
});

// API status
app.get('/api/', (req, res) => {
  res.json({
    message: "Portfolio API is running",
    version: "1.0.0",
    status: "healthy"
  });
});

// Get all visible projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find({ visible: true })
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
app.get('/api/projects/:id', async (req, res) => {
  try {
    const project = await Project.findOne({
      id: req.params.id,
      visible: true
    }).select('-__v');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Get all visible skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find({ visible: true })
      .select('-__v')
      .sort({ order: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Get all visible certificates
app.get('/api/certificates', async (req, res) => {
  try {
    const certificates = await Certificate.find({ visible: true })
      .select('-__v')
      .sort({ priority: 1 });
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const newMessage = new Message({
      name,
      email,
      subject,
      message,
      status: 'unread',
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    await newMessage.save();
    console.log(`📧 New message received from ${email}`);

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// ===== ADMIN AUTH ROUTES =====

// Admin login
app.post('/api/admin/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await AdminUser.findOne({ username }).select('-__v');
    if (!admin) {
      return res.status(401).json({ detail: 'Incorrect username or password' });
    }

    const isValidPassword = await admin.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ detail: 'Incorrect username or password' });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate token
    const token = generateToken({
      username: admin.username,
      role: admin.role
    });

    res.json({
      access_token: token,
      username: admin.username,
      role: admin.role
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ detail: 'Login failed' });
  }
});

// Verify admin token
app.get('/api/admin/auth/verify', authenticateToken, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// ===== ADMIN PROJECTS ROUTES =====

// Get all projects (admin)
app.get('/api/admin/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await Project.find({})
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Create project (admin)
app.post('/api/admin/projects', authenticateToken, async (req, res) => {
  try {
    const projectData = req.body;
    const project = new Project(projectData);
    await project.save();

    console.log(`📁 Project created: ${project.title} by ${req.user.username}`);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project (admin)
app.put('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const project = await Project.findOneAndUpdate(
      { id },
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-__v');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`📝 Project updated: ${id} by ${req.user.username}`);
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (admin)
app.delete('/api/admin/projects/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Project.findOneAndDelete({ id });

    if (!result) {
      return res.status(404).json({ error: 'Project not found' });
    }

    console.log(`🗑️ Project deleted: ${id} by ${req.user.username}`);
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// ===== ADMIN SKILLS ROUTES =====

// Get all skills (admin)
app.get('/api/admin/skills', authenticateToken, async (req, res) => {
  try {
    const skills = await Skill.find({})
      .select('-__v')
      .sort({ order: 1 });
    res.json(skills);
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Create skill (admin)
app.post('/api/admin/skills', authenticateToken, async (req, res) => {
  try {
    const skillData = req.body;
    const skill = new Skill(skillData);
    await skill.save();

    console.log(`🎯 Skill created: ${skill.name} by ${req.user.username}`);
    res.status(201).json(skill);
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({ error: 'Failed to create skill' });
  }
});

// Update skill (admin)
app.put('/api/admin/skills/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const skill = await Skill.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    console.log(`✏️ Skill updated: ${id} by ${req.user.username}`);
    res.json(skill);
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({ error: 'Failed to update skill' });
  }
});

// Delete skill (admin)
app.delete('/api/admin/skills/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Skill.findOneAndDelete({ id });

    if (!result) {
      return res.status(404).json({ error: 'Skill not found' });
    }

    console.log(`🗑️ Skill deleted: ${id} by ${req.user.username}`);
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({ error: 'Failed to delete skill' });
  }
});

// ===== ADMIN CERTIFICATES ROUTES =====

// Get all certificates (admin)
app.get('/api/admin/certificates', authenticateToken, async (req, res) => {
  try {
    const certificates = await Certificate.find({})
      .select('-__v')
      .sort({ priority: 1 });
    res.json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Create certificate (admin)
app.post('/api/admin/certificates', authenticateToken, async (req, res) => {
  try {
    const certData = req.body;
    const certificate = new Certificate(certData);
    await certificate.save();

    console.log(`🏆 Certificate created: ${certificate.name} by ${req.user.username}`);
    res.status(201).json(certificate);
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ error: 'Failed to create certificate' });
  }
});

// Update certificate (admin)
app.put('/api/admin/certificates/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const certificate = await Certificate.findOneAndUpdate(
      { id },
      updateData,
      { new: true, runValidators: true }
    ).select('-__v');

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    console.log(`✏️ Certificate updated: ${id} by ${req.user.username}`);
    res.json(certificate);
  } catch (error) {
    console.error('Error updating certificate:', error);
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

// Delete certificate (admin)
app.delete('/api/admin/certificates/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Certificate.findOneAndDelete({ id });

    if (!result) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    console.log(`🗑️ Certificate deleted: ${id} by ${req.user.username}`);
    res.json({ message: 'Certificate deleted successfully' });
  } catch (error) {
    console.error('Error deleting certificate:', error);
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// ===== ADMIN MESSAGES ROUTES =====

// Get all messages (admin)
app.get('/api/admin/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({})
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Update message status (admin)
app.put('/api/admin/messages/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.query;

    const message = await Message.findOneAndUpdate(
      { id },
      { status },
      { new: true }
    ).select('-__v');

    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    console.log(`📬 Message ${id} status updated to ${status} by ${req.user.username}`);
    res.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating message status:', error);
    res.status(500).json({ error: 'Failed to update message status' });
  }
});

// Delete message (admin)
app.delete('/api/admin/messages/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Message.findOneAndDelete({ id });

    if (!result) {
      return res.status(404).json({ error: 'Message not found' });
    }

    console.log(`🗑️ Message deleted: ${id} by ${req.user.username}`);
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// ===== ADMIN DASHBOARD STATS =====

// Get dashboard statistics (admin)
app.get('/api/admin/dashboard/stats', authenticateToken, async (req, res) => {
  try {
    const [totalProjects, totalSkills, totalCertificates, unreadMessages, totalMessages] = await Promise.all([
      Project.countDocuments({}),
      Skill.countDocuments({}),
      Certificate.countDocuments({}),
      Message.countDocuments({ status: 'unread' }),
      Message.countDocuments({})
    ]);

    res.json({
      totalProjects,
      totalSkills,
      totalCertificates,
      unreadMessages,
      totalMessages
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

// ===== ERROR HANDLING =====

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Portfolio API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/`);
  console.log(`📚 API docs: http://localhost:${PORT}/api/`);
});

module.exports = app;
