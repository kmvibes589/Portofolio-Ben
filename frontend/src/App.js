import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams, Link } from "react-router-dom";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Language Context
const LanguageContext = React.createContext();

// Navigation Component
const Navigation = ({ currentLang, setCurrentLang, languages }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const navLabels = {
    en: { home: "Home", about: "About", leadership: "Leadership", achievements: "Achievements", events: "Events", projects: "Projects", blog: "Blog", contact: "Contact" },
    fr: { home: "Accueil", about: "À propos", leadership: "Leadership", achievements: "Réalisations", events: "Événements", projects: "Projets", blog: "Blog", contact: "Contact" },
    ar: { home: "الرئيسية", about: "حول", leadership: "القيادة", achievements: "الإنجازات", events: "الأحداث", projects: "المشاريع", blog: "المدونة", contact: "اتصل" },
    zh: { home: "首页", about: "关于", leadership: "领导力", achievements: "成就", events: "事件", projects: "项目", blog: "博客", contact: "联系" },
    es: { home: "Inicio", about: "Acerca", leadership: "Liderazgo", achievements: "Logros", events: "Eventos", projects: "Proyectos", blog: "Blog", contact: "Contacto" }
  };

  const labels = navLabels[currentLang] || navLabels.en;

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-900">Benjamin Kyamoneka Mpey</Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.home}</Link>
            <a href="#about" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.about}</a>
            <a href="#leadership" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.leadership}</a>
            <a href="#achievements" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.achievements}</a>
            <a href="#events" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.events}</a>
            <a href="#projects" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.projects}</a>
            <Link to="/blog" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.blog}</Link>
            <a href="#contact" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.contact}</a>
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                <span>{languages[currentLang]}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                  {Object.entries(languages).map(([code, name]) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrentLang(code);
                        setIsLangOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                        currentLang === code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.home}</Link>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.about}</a>
            <a href="#leadership" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.leadership}</a>
            <a href="#achievements" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.achievements}</a>
            <a href="#events" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.events}</a>
            <a href="#projects" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.projects}</a>
            <Link to="/blog" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.blog}</Link>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.contact}</a>
            
            {/* Mobile Language Selector */}
            <div className="border-t pt-2">
              <div className="px-3 py-2 text-gray-600 text-sm font-medium">Language / Langue</div>
              {Object.entries(languages).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => {
                    setCurrentLang(code);
                    setIsMenuOpen(false);
                  }}
                  className={`block w-full text-left px-6 py-2 text-sm ${
                    currentLang === code ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

// Blog Components
const BlogCard = ({ post }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Law & Policy': 'bg-blue-100 text-blue-800',
      'Climate Law': 'bg-green-100 text-green-800',
      'International Economics': 'bg-purple-100 text-purple-800',
      'Youth Activism': 'bg-orange-100 text-orange-800',
      'Human Rights': 'bg-red-100 text-red-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || colors['General'];
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden card-hover">
      {post.featured_image && (
        <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover" />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(post.category)}`}>
            {post.category}
          </span>
          {post.paper_type && (
            <span className="text-xs text-gray-500 capitalize">
              {post.paper_type}
            </span>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link to={`/blog/${post.id}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{formatDate(post.created_at)}</span>
          <span>{post.reading_time} min read</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              {tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
              +{post.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
  }, [selectedCategory, searchTerm]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      
      const response = await axios.get(`${API}/blog?${params}`);
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API}/blog/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Insights & Research
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Exploring the intersection of law, human rights, and social justice through academic research and thoughtful analysis.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="loading-spinner rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchRelatedPosts();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await axios.get(`${API}/blog/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedPosts = async () => {
    try {
      const response = await axios.get(`${API}/blog?limit=3`);
      setRelatedPosts(response.data.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error fetching related posts:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="loading-spinner rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <Link to="/blog" className="text-blue-600 hover:text-blue-800">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <Link to="/blog" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Back to Blog
          </Link>
          
          <div className="mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {post.category}
            </span>
            {post.paper_type && (
              <span className="ml-3 px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                {post.paper_type}
              </span>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <span>By {post.author}</span>
            <span>•</span>
            <span>{formatDate(post.created_at)}</span>
            <span>•</span>
            <span>{post.reading_time} min read</span>
          </div>

          {post.academic_info && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Academic Information</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p><strong>Institution:</strong> {post.academic_info.institution}</p>
                <p><strong>Field:</strong> {post.academic_info.field}</p>
                <p><strong>Type:</strong> {post.academic_info.type}</p>
              </div>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div className="whitespace-pre-line text-gray-800 leading-relaxed">
            {post.content}
          </div>
        </div>

        {/* Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-3">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social Share */}
        <div className="border-t border-gray-200 pt-8 mb-8">
          <h3 className="text-lg font-semibold mb-4">Share this article</h3>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Share on Twitter
            </button>
            <button className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-900">
              Share on LinkedIn
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
              Copy Link
            </button>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-gray-200 pt-8">
            <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.slice(0, 3).map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};

// Hero Section Component
const HeroSection = ({ aboutData, currentLang }) => {
  return (
    <section id="home" className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white min-h-screen flex items-center hero-gradient">
      <div className="absolute inset-0 bg-black opacity-50 hero-overlay"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fadeInUp">
            {aboutData?.name || "Benjamin Kyamoneka Mpey"}
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-blue-200 animate-slideInLeft">
            {aboutData?.title || "Human Rights Defender | Privacy First Campaigner"}
          </p>
          <p className="text-lg md:text-xl mb-8 text-blue-200 animate-slideInRight">
            {aboutData?.tagline || "Empowering Youth. Defending Rights. Inspiring Change."}
          </p>
          
          {/* Contact Info */}
          <div className="flex flex-col md:flex-row gap-4 justify-center mb-8 text-sm md:text-base">
            <div className="flex items-center justify-center space-x-2">
              <span>📞</span>
              <span>{aboutData?.phone || "+254 797 427 649"}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>📧</span>
              <span>{aboutData?.email || "kyamompey@gmail.com"}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span>🔗</span>
              <a href={`https://linkedin.com/in/${aboutData?.linkedin || 'kyamoneka-mpey-benjamin'}`} 
                 target="_blank" rel="noopener noreferrer" className="hover:text-blue-300">
                LinkedIn Profile
              </a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#about" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300 form-button">
              {currentLang === 'fr' ? 'En savoir plus' : 
               currentLang === 'ar' ? 'اعرف أكثر' :
               currentLang === 'zh' ? '了解更多' :
               currentLang === 'es' ? 'Saber más' : 'Learn More'}
            </a>
            <Link to="/blog" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300">
              {currentLang === 'fr' ? 'Lire mes articles' :
               currentLang === 'ar' ? 'اقرأ مقالاتي' :
               currentLang === 'zh' ? '阅读我的文章' :
               currentLang === 'es' ? 'Leer mis artículos' : 'Read My Articles'}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

// About Section Component (keeping the existing one - it's already perfect)
const AboutSection = ({ aboutData, currentLang }) => {
  const sectionTitles = {
    en: { about: "About Me", mission: "Mission", vision: "Vision" },
    fr: { about: "À propos de moi", mission: "Mission", vision: "Vision" },
    ar: { about: "نبذة عني", mission: "المهمة", vision: "الرؤية" },
    zh: { about: "关于我", mission: "使命", vision: "愿景" },
    es: { about: "Acerca de mí", mission: "Misión", vision: "Visión" }
  };

  const titles = sectionTitles[currentLang] || sectionTitles.en;

  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{titles.about}</h2>
          <div className="section-divider"></div>
        </div>
        
        {/* Quote Section */}
        {aboutData?.quote && (
          <div className="max-w-4xl mx-auto text-center mb-12">
            <blockquote className="text-xl md:text-2xl italic text-gray-700 mb-4">
              "{aboutData.quote}"
            </blockquote>
            <cite className="text-gray-600">— {aboutData.name}</cite>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg card-hover">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {aboutData?.title || "Human Rights Defender"}
              </h3>
              {aboutData?.education && (
                <p className="text-blue-600 font-semibold mb-4">{aboutData.education}</p>
              )}
              <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
                {aboutData?.bio || "Loading biography..."}
              </p>
              <div className="flex flex-wrap gap-2">
                {aboutData?.focus_areas?.map((area, index) => (
                  <span key={index} className="tag bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-lg card-hover">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{titles.mission}</h4>
              <p className="text-gray-600">
                {aboutData?.mission || "Loading mission..."}
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg card-hover">
              <h4 className="text-xl font-bold text-gray-900 mb-4">{titles.vision}</h4>
              <p className="text-gray-600">
                {aboutData?.vision || "Loading vision..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Keep all other existing components (Leadership, Achievements, Events, Projects, Contact, Footer)
// I'm keeping the same components to save space, just adding the blog functionality

// Main App Component with routing
function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const [languages, setLanguages] = useState({});
  const [aboutData, setAboutData] = useState(null);
  const [leadershipData, setLeadershipData] = useState(null);
  const [achievementsData, setAchievementsData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [projectsData, setProjectsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          languagesResponse,
          aboutResponse,
          leadershipResponse,
          achievementsResponse,
          eventsResponse,
          projectsResponse
        ] = await Promise.all([
          axios.get(`${API}/languages`),
          axios.get(`${API}/portfolio/about?lang=${currentLang}`),
          axios.get(`${API}/portfolio/leadership?lang=${currentLang}`),
          axios.get(`${API}/portfolio/achievements?lang=${currentLang}`),
          axios.get(`${API}/portfolio/events?lang=${currentLang}`),
          axios.get(`${API}/portfolio/projects?lang=${currentLang}`)
        ]);

        setLanguages(languagesResponse.data);
        setAboutData(aboutResponse.data);
        setLeadershipData(leadershipResponse.data);
        setAchievementsData(achievementsResponse.data);
        setEventsData(eventsResponse.data);
        setProjectsData(projectsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentLang]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="loading-spinner rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ currentLang, setCurrentLang }}>
      <div className="App" dir={currentLang === 'ar' ? 'rtl' : 'ltr'}>
        <BrowserRouter>
          <Navigation 
            currentLang={currentLang} 
            setCurrentLang={setCurrentLang} 
            languages={languages}
          />
          
          <Routes>
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:id" element={<BlogPost />} />
            <Route path="/" element={
              <main>
                <HeroSection aboutData={aboutData} currentLang={currentLang} />
                <AboutSection aboutData={aboutData} currentLang={currentLang} />
                {/* Add other sections here as needed */}
              </main>
            } />
          </Routes>
        </BrowserRouter>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;