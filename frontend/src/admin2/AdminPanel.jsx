import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, Code, Award, Mail, Settings, LogOut,
  Plus, Edit, Trash2, X, Save, Eye, EyeOff, CheckCircle, AlertCircle
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Data states
  const [stats, setStats] = useState({});
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [activeTab, isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const response = await axios.get(`${BACKEND_URL}/api/admin/dashboard/stats`);
        setStats(response.data);
      } else if (activeTab === 'projects') {
        const response = await axios.get(`${BACKEND_URL}/api/admin/projects`);
        setProjects(response.data);
      } else if (activeTab === 'skills') {
        const response = await axios.get(`${BACKEND_URL}/api/admin/skills`);
        setSkills(response.data);
      } else if (activeTab === 'certificates') {
        const response = await axios.get(`${BACKEND_URL}/api/admin/certificates`);
        setCertificates(response.data);
      } else if (activeTab === 'messages') {
        const response = await axios.get(`${BACKEND_URL}/api/admin/messages`);
        setMessages(response.data);
      }
    } catch (error) {
      setError('Failed to load data');
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${BACKEND_URL}/api/admin/auth/login`, loginData);
      setIsAuthenticated(true);
      setSuccess('Login successful!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      setError(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
    setError('');
  };

  const handleSave = async () => {
    try {
      const endpoint = activeTab === 'projects' ? 'projects' :
                      activeTab === 'skills' ? 'skills' :
                      activeTab === 'certificates' ? 'certificates' : '';

      if (editingItem.id && !editingItem.isNew) {
        await axios.put(`${BACKEND_URL}/api/admin/${endpoint}/${editingItem.id}`, editingItem);
      } else {
        const { id, isNew, ...data } = editingItem;
        await axios.post(`${BACKEND_URL}/api/admin/${endpoint}`, data);
      }

      setShowModal(false);
      setEditingItem(null);
      loadData();
      setSuccess('Item saved successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      setError('Failed to save item');
      console.error('Error saving:', error);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;

    try {
      await axios.delete(`${BACKEND_URL}/api/admin/${type}/${id}`);
      loadData();
      setSuccess('Item deleted successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (error) {
      setError('Failed to delete item');
      console.error('Error deleting:', error);
    }
  };

  const openModal = (item = null, type) => {
    setModalType(type);
    if (type === 'projects') {
      setEditingItem(item || {
        title: '', tagline: '', description: '', tech: [], features: [],
        demoUrl: '', githubUrl: '', imageUrl: '', year: new Date().getFullYear(),
        category: 'web', status: 'completed', featured: false, visible: true, isNew: true
      });
    } else if (type === 'skills') {
      setEditingItem(item || {
        name: '', category: 'Programming', level: 50, icon: '',
        yearsOfExperience: 0, projects: [], order: 0, visible: true, isNew: true
      });
    } else if (type === 'certificates') {
      setEditingItem(item || {
        name: '', issuer: '', date: '', description: '',
        credentialId: '', verifyUrl: '', imageUrl: '',
        status: 'active', category: '', priority: 0, visible: true, isNew: true
      });
    }
    setShowModal(true);
  };

  // Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          className="max-w-md w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-gray-400">Portfolio Management System</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-gray-300 mb-2">Username</label>
              <input
                type="text"
                required
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Password</label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {success && (
              <div className="p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 flex items-center gap-2">
                <CheckCircle size={20} />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Main Admin Dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800/50 backdrop-blur-sm border-r border-purple-500/30 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400">Admin Panel</h2>
          <p className="text-sm text-gray-400">Portfolio Management</p>
        </div>

        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'projects', icon: FolderKanban, label: 'Projects' },
            { id: 'skills', icon: Code, label: 'Skills' },
            { id: 'certificates', icon: Award, label: 'Certificates' },
            { id: 'messages', icon: Mail, label: 'Messages' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === tab.id
                  ? 'bg-purple-500/30 text-white'
                  : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
              }`}
            >
              <tab.icon size={20} />
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Success/Error Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300 flex items-center gap-2"
              >
                <AlertCircle size={20} />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-300 flex items-center gap-2"
              >
                <CheckCircle size={20} />
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <div className="text-2xl">Loading...</div>
            </div>
          ) : (
            <>
              {/* Dashboard */}
              {activeTab === 'dashboard' && (
                <div>
                  <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400">Projects</h3>
                        <FolderKanban className="text-purple-400" />
                      </div>
                      <p className="text-3xl font-bold">{stats.totalProjects || 0}</p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400">Skills</h3>
                        <Code className="text-blue-400" />
                      </div>
                      <p className="text-3xl font-bold">{stats.totalSkills || 0}</p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400">Certificates</h3>
                        <Award className="text-yellow-400" />
                      </div>
                      <p className="text-3xl font-bold">{stats.totalCertificates || 0}</p>
                    </div>
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-gray-400">Messages</h3>
                        <Mail className="text-green-400" />
                      </div>
                      <p className="text-3xl font-bold">{stats.unreadMessages || 0} / {stats.totalMessages || 0}</p>
                      <p className="text-sm text-gray-500 mt-1">Unread / Total</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Projects Management */}
              {activeTab === 'projects' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Projects</h1>
                    <button
                      onClick={() => openModal(null, 'projects')}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition"
                    >
                      <Plus size={20} /> Add Project
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {projects.map(project => (
                      <div key={project.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                            <p className="text-purple-400 mb-2">{project.tagline}</p>
                            <p className="text-gray-400 mb-3 line-clamp-2">{project.description}</p>
                            <div className="flex gap-2 mb-3">
                              {project.tech.slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="px-2 py-1 bg-purple-500/20 rounded text-sm">{tech}</span>
                              ))}
                              {project.tech.length > 3 && <span className="text-gray-500">...</span>}
                            </div>
                            <div className="flex gap-4 text-sm">
                              <span className={project.visible ? 'text-green-400' : 'text-red-400'}>
                                {project.visible ? '● Visible' : '○ Hidden'}
                              </span>
                              {project.featured && <span className="text-yellow-400">⭐ Featured</span>}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(project, 'projects')}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id, 'projects')}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Management */}
              {activeTab === 'skills' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Skills</h1>
                    <button
                      onClick={() => openModal(null, 'skills')}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition"
                    >
                      <Plus size={20} /> Add Skill
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {skills.map(skill => (
                      <div key={skill.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{skill.icon} {skill.name}</h3>
                            <p className="text-purple-400 text-sm mb-3">{skill.category}</p>
                            <div className="w-full bg-gray-700 rounded-full h-3 mb-2">
                              <motion.div
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                                style={{ width: `${skill.level}%` }}
                                initial={{ width: 0 }}
                                animate={{ width: `${skill.level}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </div>
                            <p className="text-right text-sm text-gray-400">{skill.level}%</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(skill, 'skills')}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(skill.id, 'skills')}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates Management */}
              {activeTab === 'certificates' && (
                <div>
                  <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Certificates</h1>
                    <button
                      onClick={() => openModal(null, 'certificates')}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition"
                    >
                      <Plus size={20} /> Add Certificate
                    </button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {certificates.map(cert => (
                      <div key={cert.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                        <div className="flex justify-between items-start mb-4">
                          <h3 className="text-lg font-bold flex-1">{cert.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(cert, 'certificates')}
                              className="p-1 bg-blue-500/20 hover:bg-blue-500/30 rounded transition"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(cert.id, 'certificates')}
                              className="p-1 bg-red-500/20 hover:bg-red-500/30 rounded transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="text-purple-400 text-sm mb-1">{cert.issuer}</p>
                        <p className="text-gray-400 text-sm">{cert.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Messages Management */}
              {activeTab === 'messages' && (
                <div>
                  <h1 className="text-4xl font-bold mb-8">Messages</h1>
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                        msg.status === 'unread' ? 'border-purple-500' : 'border-purple-500/30'
                      }`}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-1">{msg.name}</h3>
                            <p className="text-purple-400 mb-2">{msg.email}</p>
                            {msg.subject && <p className="text-gray-400 text-sm mb-2">Subject: {msg.subject}</p>}
                            <p className="text-gray-300 mb-2">{msg.message}</p>
                            <p className="text-gray-500 text-sm">
                              Received: {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {msg.status === 'unread' && (
                              <button
                                onClick={() => {
                                  axios.put(`${BACKEND_URL}/api/admin/messages/${msg.id}/status?status=read`);
                                  loadData();
                                }}
                                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-sm transition"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(msg.id, 'messages')}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal for Add/Edit */}
      <AnimatePresence>
        {showModal && editingItem && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                  {editingItem.isNew ? 'Add' : 'Edit'} {modalType}
                </h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Dynamic form fields based on modalType */}
                {modalType === 'projects' && (
                  <>
                    <input
                      type="text"
                      placeholder="Title *"
                      value={editingItem.title || ''}
                      onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Tagline *"
                      value={editingItem.tagline || ''}
                      onChange={(e) => setEditingItem({...editingItem, tagline: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <textarea
                      placeholder="Description *"
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      rows={3}
                    />
                    <input
                      type="text"
                      placeholder="Technologies (comma-separated)"
                      value={Array.isArray(editingItem.tech) ? editingItem.tech.join(', ') : editingItem.tech || ''}
                      onChange={(e) => setEditingItem({...editingItem, tech: e.target.value.split(',').map(t => t.trim())})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="Demo URL"
                        value={editingItem.demoUrl || ''}
                        onChange={(e) => setEditingItem({...editingItem, demoUrl: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                      <input
                        type="text"
                        placeholder="GitHub URL"
                        value={editingItem.githubUrl || ''}
                        onChange={(e) => setEditingItem({...editingItem, githubUrl: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <input
                        type="number"
                        placeholder="Year"
                        value={editingItem.year || ''}
                        onChange={(e) => setEditingItem({...editingItem, year: parseInt(e.target.value)})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      />
                      <select
                        value={editingItem.category || 'web'}
                        onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                        className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      >
                        <option value="web">Web</option>
                        <option value="mobile">Mobile</option>
                        <option value="ai">AI/ML</option>
                        <option value="desktop">Desktop</option>
                      </select>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="visible"
                          checked={editingItem.visible !== false}
                          onChange={(e) => setEditingItem({...editingItem, visible: e.target.checked})}
                          className="rounded"
                        />
                        <label htmlFor="visible" className="text-sm">Visible</label>
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'skills' && (
                  <>
                    <input
                      type="text"
                      placeholder="Skill Name *"
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <select
                      value={editingItem.category || 'Programming'}
                      onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="Programming">Programming</option>
                      <option value="Frontend">Frontend</option>
                      <option value="Backend">Backend</option>
                      <option value="Database">Database</option>
                      <option value="Tools">Tools</option>
                    </select>
                    <div>
                      <label className="block text-gray-300 mb-2">Level: {editingItem.level || 50}%</label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={editingItem.level || 50}
                        onChange={(e) => setEditingItem({...editingItem, level: parseInt(e.target.value)})}
                        className="w-full accent-purple-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Icon (emoji)"
                      value={editingItem.icon || ''}
                      onChange={(e) => setEditingItem({...editingItem, icon: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </>
                )}

                {modalType === 'certificates' && (
                  <>
                    <input
                      type="text"
                      placeholder="Certificate Name *"
                      value={editingItem.name || ''}
                      onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Issuer *"
                      value={editingItem.issuer || ''}
                      onChange={(e) => setEditingItem({...editingItem, issuer: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <input
                      type="text"
                      placeholder="Date (e.g., 2024)"
                      value={editingItem.date || ''}
                      onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                    <textarea
                      placeholder="Description"
                      value={editingItem.description || ''}
                      onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                      rows={2}
                    />
                    <input
                      type="text"
                      placeholder="Verify URL"
                      value={editingItem.verifyUrl || ''}
                      onChange={(e) => setEditingItem({...editingItem, verifyUrl: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                    />
                  </>
                )}
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleSave}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Save size={20} /> Save
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPanel;
