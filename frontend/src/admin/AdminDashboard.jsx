import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  getDashboardStats, adminGetProjects, adminGetSkills, adminGetCertificates, adminGetMessages,
  adminCreateProject, adminUpdateProject, adminDeleteProject,
  adminCreateSkill, adminUpdateSkill, adminDeleteSkill,
  adminCreateCertificate, adminUpdateCertificate, adminDeleteCertificate,
  adminUpdateMessageStatus, adminDeleteMessage
} from '../services/api';
import { 
  LayoutDashboard, FolderKanban, Award, Mail, Settings, LogOut,
  Plus, Edit, Trash2, X, Save, Code, MessageSquare
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    } else {
      loadData();
    }
  }, [isAuthenticated, activeTab, navigate]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await getDashboardStats();
        setStats(res.data);
      } else if (activeTab === 'projects') {
        const res = await adminGetProjects();
        setProjects(res.data);
      } else if (activeTab === 'skills') {
        const res = await adminGetSkills();
        setSkills(res.data);
      } else if (activeTab === 'certificates') {
        const res = await adminGetCertificates();
        setCertificates(res.data);
      } else if (activeTab === 'messages') {
        const res = await adminGetMessages();
        setMessages(res.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleSave = async () => {
    try {
      if (activeTab === 'projects') {
        if (editingItem.id && !editingItem.isNew) {
          await adminUpdateProject(editingItem.id, editingItem);
        } else {
          const { id, isNew, createdAt, updatedAt, ...data } = editingItem;
          await adminCreateProject(data);
        }
      } else if (activeTab === 'skills') {
        if (editingItem.id && !editingItem.isNew) {
          await adminUpdateSkill(editingItem.id, editingItem);
        } else {
          const { id, isNew, createdAt, ...data } = editingItem;
          await adminCreateSkill(data);
        }
      } else if (activeTab === 'certificates') {
        if (editingItem.id && !editingItem.isNew) {
          await adminUpdateCertificate(editingItem.id, editingItem);
        } else {
          const { id, isNew, createdAt, ...data } = editingItem;
          await adminCreateCertificate(data);
        }
      }
      setShowModal(false);
      setEditingItem(null);
      loadData();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Please try again.');
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      if (type === 'project') {
        await adminDeleteProject(id);
      } else if (type === 'skill') {
        await adminDeleteSkill(id);
      } else if (type === 'certificate') {
        await adminDeleteCertificate(id);
      } else if (type === 'message') {
        await adminDeleteMessage(id);
      }
      loadData();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  const handleMarkRead = async (id, status) => {
    try {
      await adminUpdateMessageStatus(id, status);
      loadData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const openModal = (item = null) => {
    if (activeTab === 'projects') {
      setEditingItem(item || {
        title: '', tagline: '', description: '', longDescription: '',
        tech: [], features: [], demoUrl: '', githubUrl: '', imageUrl: '',
        year: new Date().getFullYear(), category: 'web', status: 'completed',
        featured: false, visible: true, isNew: true
      });
    } else if (activeTab === 'skills') {
      setEditingItem(item || {
        name: '', category: 'Programming', level: 50, icon: '',
        yearsOfExperience: 0, projects: [], order: 0, visible: true, isNew: true
      });
    } else if (activeTab === 'certificates') {
      setEditingItem(item || {
        name: '', issuer: '', date: '', description: '',
        credentialId: '', verifyUrl: '', imageUrl: '',
        status: 'active', category: '', priority: 0, visible: true, isNew: true
      });
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white admin-page">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-800/50 backdrop-blur-sm border-r border-purple-500/30 p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-purple-400">Admin Panel</h2>
          <p className="text-sm text-gray-400">Welcome, {user?.username}</p>
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
          {loading ? (
            <div className="text-center py-20">
              <div className="text-2xl">Loading...</div>
            </div>
          ) : (
            <>
              {/* Dashboard Stats */}
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
                      onClick={() => openModal()}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition"
                    >
                      <Plus size={20} /> Add Project
                    </button>
                  </div>
                  <div className="space-y-4">
                    {projects.map(project => (
                      <div key={project.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                            <p className="text-purple-400 mb-2">{project.tagline}</p>
                            <p className="text-gray-400 mb-3">{project.description}</p>
                            <div className="flex gap-2 mb-3">
                              {project.tech.map((tech, idx) => (
                                <span key={idx} className="px-2 py-1 bg-purple-500/20 rounded text-sm">{tech}</span>
                              ))}
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
                              onClick={() => openModal(project)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleDelete(project.id, 'project')}
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
                      onClick={() => openModal()}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition"
                    >
                      <Plus size={20} /> Add Skill
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    {skills.map(skill => (
                      <div key={skill.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold">{skill.icon} {skill.name}</h3>
                            <p className="text-purple-400 text-sm">{skill.category}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(skill)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(skill.id, 'skill')}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                        <p className="text-right text-sm text-gray-400 mt-1">{skill.level}%</p>
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
                      onClick={() => openModal()}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 px-6 py-3 rounded-lg transition"
                    >
                      <Plus size={20} /> Add Certificate
                    </button>
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    {certificates.map(cert => (
                      <div key={cert.id} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-lg font-bold flex-1">{cert.name}</h3>
                          <div className="flex gap-2">
                            <button
                              onClick={() => openModal(cert)}
                              className="p-1 bg-blue-500/20 hover:bg-blue-500/30 rounded transition"
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => handleDelete(cert.id, 'certificate')}
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

              {/* Messages Inbox */}
              {activeTab === 'messages' && (
                <div>
                  <h1 className="text-4xl font-bold mb-8">Messages</h1>
                  <div className="space-y-4">
                    {messages.map(msg => (
                      <div key={msg.id} className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border ${
                        msg.status === 'unread' ? 'border-purple-500' : 'border-purple-500/30'
                      }`}>
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-bold">{msg.name}</h3>
                            <p className="text-purple-400">{msg.email}</p>
                            {msg.subject && <p className="text-gray-400 text-sm mt-1">Subject: {msg.subject}</p>}
                          </div>
                          <div className="flex gap-2">
                            {msg.status === 'unread' && (
                              <button
                                onClick={() => handleMarkRead(msg.id, 'read')}
                                className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 rounded text-sm transition"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(msg.id, 'message')}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-300 mb-2">{msg.message}</p>
                        <p className="text-gray-500 text-sm">
                          Received: {new Date(msg.createdAt).toLocaleString()}
                        </p>
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
      {showModal && editingItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                {editingItem.isNew ? 'Add' : 'Edit'} {activeTab.slice(0, -1).charAt(0).toUpperCase() + activeTab.slice(1, -1)}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Dynamic form fields based on activeTab */}
              {activeTab === 'projects' && (
                <>
                  <input
                    type="text"
                    placeholder="Title *"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Tagline *"
                    value={editingItem.tagline}
                    onChange={(e) => setEditingItem({...editingItem, tagline: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                  <textarea
                    placeholder="Description *"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                    rows={3}
                  />
                  <input
                    type="text"
                    placeholder="Technologies (comma-separated)"
                    value={Array.isArray(editingItem.tech) ? editingItem.tech.join(', ') : editingItem.tech}
                    onChange={(e) => setEditingItem({...editingItem, tech: e.target.value.split(',').map(t => t.trim())})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editingItem.imageUrl}
                    onChange={(e) => setEditingItem({...editingItem, imageUrl: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Year"
                      value={editingItem.year}
                      onChange={(e) => setEditingItem({...editingItem, year: parseInt(e.target.value)})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                    />
                    <select
                      value={editingItem.visible}
                      onChange={(e) => setEditingItem({...editingItem, visible: e.target.value === 'true'})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                    >
                      <option value="true">Visible</option>
                      <option value="false">Hidden</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'skills' && (
                <>
                  <input
                    type="text"
                    placeholder="Skill Name *"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  >
                    <option>Programming</option>
                    <option>Frontend</option>
                    <option>Backend</option>
                    <option>Database</option>
                  </select>
                  <div>
                    <label className="block text-gray-300 mb-2">Level: {editingItem.level}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={editingItem.level}
                      onChange={(e) => setEditingItem({...editingItem, level: parseInt(e.target.value)})}
                      className="w-full"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Icon (emoji)"
                    value={editingItem.icon}
                    onChange={(e) => setEditingItem({...editingItem, icon: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                </>
              )}

              {activeTab === 'certificates' && (
                <>
                  <input
                    type="text"
                    placeholder="Certificate Name *"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({...editingItem, name: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Issuer *"
                    value={editingItem.issuer}
                    onChange={(e) => setEditingItem({...editingItem, issuer: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                  <input
                    type="text"
                    placeholder="Date (e.g., 2024)"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                  />
                  <textarea
                    placeholder="Description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
                    rows={2}
                  />
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={editingItem.imageUrl}
                    onChange={(e) => setEditingItem({...editingItem, imageUrl: e.target.value})}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white"
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
