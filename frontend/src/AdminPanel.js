import React, { useState, useEffect } from "react";
import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Admin Login Component
const AdminLogin = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API}/admin/login`, credentials);
      const { access_token } = response.data;
      localStorage.setItem('admin_token', access_token);
      onLogin(access_token);
    } catch (error) {
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Admin Panel Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {error && (
            <div className="mb-4 text-red-600 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Media Management Component
const MediaManager = ({ token }) => {
  const [mediaFiles, setMediaFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState('general');
  const [description, setDescription] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMediaFiles();
  }, [filter]);

  const fetchMediaFiles = async () => {
    try {
      const params = filter !== 'all' ? `?file_type=${filter}` : '';
      const response = await axios.get(`${API}/admin/media${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMediaFiles(response.data);
    } catch (error) {
      console.error('Error fetching media files:', error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('category', category);
    formData.append('description', description);

    try {
      await axios.post(`${API}/admin/media/upload`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setSelectedFile(null);
      setDescription('');
      fetchMediaFiles();
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      setUploading(false);
    }
  };

  const deleteMedia = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file?')) return;

    try {
      await axios.delete(`${API}/admin/media/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMediaFiles();
      alert('File deleted successfully!');
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Error deleting file');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Media Manager</h2>
      
      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">Upload New Media</h3>
        <form onSubmit={handleFileUpload}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File
              </label>
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="general">General</option>
                <option value="profile">Profile Photo</option>
                <option value="hero">Hero Background</option>
                <option value="background">Background Image</option>
                <option value="blog">Blog Media</option>
                <option value="video">Video Content</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading || !selectedFile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload File'}
          </button>
        </form>
      </div>

      {/* Filter Section */}
      <div className="mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            All Files
          </button>
          <button
            onClick={() => setFilter('image')}
            className={`px-4 py-2 rounded-md ${filter === 'image' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Images
          </button>
          <button
            onClick={() => setFilter('video')}
            className={`px-4 py-2 rounded-md ${filter === 'video' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            Videos
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {mediaFiles.map((file) => (
          <div key={file.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="aspect-w-16 aspect-h-9">
              {file.file_type === 'image' ? (
                <img
                  src={`${BACKEND_URL}${file.file_path}`}
                  alt={file.description || file.original_filename}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <video
                  src={`${BACKEND_URL}${file.file_path}`}
                  className="w-full h-48 object-cover"
                  controls
                />
              )}
            </div>
            <div className="p-4">
              <h4 className="font-semibold text-sm mb-2 truncate">
                {file.original_filename}
              </h4>
              <div className="text-xs text-gray-600 space-y-1">
                <p>Category: {file.category}</p>
                <p>Size: {formatFileSize(file.file_size)}</p>
                <p>Uploaded: {new Date(file.upload_date).toLocaleDateString()}</p>
                {file.description && <p>Description: {file.description}</p>}
              </div>
              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => navigator.clipboard.writeText(`${BACKEND_URL}${file.file_path}`)}
                  className="text-blue-600 hover:text-blue-800 text-xs"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => deleteMedia(file.id)}
                  className="text-red-600 hover:text-red-800 text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mediaFiles.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No media files found. Upload some files to get started.
        </div>
      )}
    </div>
  );
};

// Blog Manager Component
const BlogManager = ({ token }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'general',
    tags: '',
    featured_image: '',
    featured_video: '',
    paper_type: '',
    published: true
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${API}/admin/blog`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      academic_info: formData.paper_type ? {
        type: formData.paper_type,
        institution: "Mount Kenya University",
        field: "Law and Human Rights"
      } : null
    };

    try {
      if (isEditing && selectedPost) {
        await axios.put(`${API}/admin/blog/${selectedPost.id}`, postData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Post updated successfully!');
      } else {
        await axios.post(`${API}/admin/blog`, postData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('Post created successfully!');
      }
      
      resetForm();
      fetchPosts();
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      excerpt: '',
      category: 'general',
      tags: '',
      featured_image: '',
      featured_video: '',
      paper_type: '',
      published: true
    });
    setSelectedPost(null);
    setIsEditing(false);
  };

  const editPost = (post) => {
    setSelectedPost(post);
    setIsEditing(true);
    setFormData({
      title: post.title || '',
      content: post.content || '',
      excerpt: post.excerpt || '',
      category: post.category || 'general',
      tags: post.tags?.join(', ') || '',
      featured_image: post.featured_image || '',
      featured_video: post.featured_video || '',
      paper_type: post.paper_type || '',
      published: post.published
    });
  };

  const deletePost = async (postId) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await axios.delete(`${API}/admin/blog/${postId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchPosts();
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Error deleting post');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Blog Manager</h2>
      
      {/* Post Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? 'Edit Post' : 'Create New Post'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="general">General</option>
                <option value="Law & Policy">Law & Policy</option>
                <option value="Climate Law">Climate Law</option>
                <option value="International Economics">International Economics</option>
                <option value="Youth Activism">Youth Activism</option>
                <option value="Human Rights">Human Rights</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Paper Type
              </label>
              <select
                value={formData.paper_type}
                onChange={(e) => setFormData({...formData, paper_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select Type</option>
                <option value="academic">Academic Paper</option>
                <option value="article">Article</option>
                <option value="research">Research</option>
                <option value="opinion">Opinion Piece</option>
              </select>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="human rights, climate, law..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Image URL
              </label>
              <input
                type="url"
                value={formData.featured_image}
                onChange={(e) => setFormData({...formData, featured_image: e.target.value})}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Featured Video URL
              </label>
              <input
                type="url"
                value={formData.featured_video}
                onChange={(e) => setFormData({...formData, featured_video: e.target.value})}
                placeholder="https://example.com/video.mp4"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({...formData, published: e.target.checked})}
                  className="mr-2"
                />
                Published
              </label>
            </div>
          </div>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
            >
              {isEditing ? 'Update Post' : 'Create Post'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Posts List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">All Posts</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                      {post.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {post.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      post.published ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => editPost(post)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deletePost(post.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// Contact Messages Component
const ContactManager = ({ token }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API}/admin/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Messages</h2>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {messages.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No contact messages yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {messages.map((message) => (
              <div key={message.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {message.subject}
                    </h3>
                    <p className="text-sm text-gray-600">
                      From: {message.name} ({message.email})
                    </p>
                    <p className="text-sm text-gray-500">
                      Type: {message.message_type} | 
                      Date: {new Date(message.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-gray-700">
                  {message.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Main Admin Panel Component
const AdminPanel = () => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [activeTab, setActiveTab] = useState('media');

  const handleLogin = (newToken) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Benjamin's Portfolio - Admin Panel
            </h1>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-64 bg-white shadow-sm min-h-screen">
          <div className="p-4">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('media')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'media' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📸 Media Manager
              </button>
              <button
                onClick={() => setActiveTab('blog')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'blog' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📝 Blog Manager
              </button>
              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeTab === 'contact' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                📧 Contact Messages
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1">
          {activeTab === 'media' && <MediaManager token={token} />}
          {activeTab === 'blog' && <BlogManager token={token} />}
          {activeTab === 'contact' && <ContactManager token={token} />}
        </main>
      </div>
    </div>
  );
};

export default AdminPanel;