import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import "./App.css";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navigation Component
const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-gray-900">Benjamin Kyamoneka Mpey</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Home</a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
            <a href="#leadership" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Leadership</a>
            <a href="#achievements" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Achievements</a>
            <a href="#events" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Events</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">Contact</a>
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
            <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Home</a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">About</a>
            <a href="#leadership" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Leadership</a>
            <a href="#achievements" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Achievements</a>
            <a href="#events" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Events</a>
            <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

// Hero Section Component
const HeroSection = ({ aboutData }) => {
  return (
    <section id="home" className="relative bg-gradient-to-r from-blue-900 to-purple-900 text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {aboutData?.name || "Benjamin Kyamoneka Mpey"}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-200">
            {aboutData?.tagline || "Empowering Youth. Defending Rights. Inspiring Change."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#about" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition duration-300">
              Learn More
            </a>
            <a href="#contact" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300">
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// About Section Component
const AboutSection = ({ aboutData }) => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {aboutData?.title || "Youth Leader & Human Rights Activist"}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {aboutData?.bio || "Loading biography..."}
              </p>
              <div className="flex flex-wrap gap-2">
                {aboutData?.focus_areas?.map((area, index) => (
                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4">Mission</h4>
              <p className="text-gray-600 mb-6">
                {aboutData?.mission || "Loading mission..."}
              </p>
              
              <h4 className="text-xl font-bold text-gray-900 mb-4">Vision</h4>
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

// Leadership Section Component
const LeadershipSection = ({ leadershipData }) => {
  return (
    <section id="leadership" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Leadership & Advocacy</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Current Positions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Current Positions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {leadershipData?.current_positions?.map((position, index) => (
              <div key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg shadow-md">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{position.title}</h4>
                <p className="text-blue-600 font-semibold mb-2">{position.organization}</p>
                <p className="text-gray-600 text-sm mb-3">{position.period}</p>
                <p className="text-gray-700 mb-4">{position.description}</p>
                <ul className="text-gray-600 text-sm space-y-1">
                  {position.responsibilities?.map((resp, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Past Positions */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Past Positions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {leadershipData?.past_positions?.map((position, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md leadership-card-past">
                <h4 className="text-xl font-bold text-gray-900 mb-2">{position.title}</h4>
                <p className="text-blue-600 font-semibold mb-2">{position.organization}</p>
                <p className="text-gray-600 text-sm mb-3">{position.period}</p>
                <p className="text-gray-700 mb-4">{position.description}</p>
                <ul className="text-gray-600 text-sm space-y-1">
                  {position.responsibilities?.map((resp, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// Achievements Section Component
const AchievementsSection = ({ achievementsData }) => {
  return (
    <section id="achievements" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Achievements & Recognition</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Fellowships */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🌍 International Fellowships</h3>
            <div className="space-y-4">
              {achievementsData?.fellowships?.map((fellowship, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md achievement-card achievement-fellowship">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{fellowship.title}</h4>
                  <p className="text-blue-600 font-semibold mb-1">{fellowship.organization}</p>
                  <p className="text-gray-600 text-sm mb-2">{fellowship.year} • {fellowship.location}</p>
                  {fellowship.distinction && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {fellowship.distinction}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🏆 Awards & Recognition</h3>
            <div className="space-y-4">
              {achievementsData?.awards?.map((award, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md achievement-card achievement-award">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{award.title}</h4>
                  <p className="text-blue-600 font-semibold mb-1">{award.organization}</p>
                  <p className="text-gray-600 text-sm">{award.year}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Events Section Component
const EventsSection = ({ eventsData }) => {
  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Events & Engagements</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Upcoming Events */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">📅 Upcoming Events</h3>
            <div className="space-y-4">
              {eventsData?.upcoming_events?.map((event, index) => (
                <div key={index} className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h4>
                  <p className="text-blue-600 font-semibold mb-1">{event.location}</p>
                  <p className="text-gray-600 text-sm mb-3">{event.date} • {event.type}</p>
                  <p className="text-gray-700">{event.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Past Events */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">🎯 Past Events</h3>
            <div className="space-y-4">
              {eventsData?.past_events?.map((event, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg shadow-md">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h4>
                  <p className="text-blue-600 font-semibold mb-1">{event.location}</p>
                  <p className="text-gray-600 text-sm mb-3">{event.date} • {event.type}</p>
                  <p className="text-gray-700">{event.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Contact Section Component
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    message_type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('');

    try {
      await axios.post(`${API}/contact`, formData);
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        message_type: 'general'
      });
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error sending message:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            Ready to collaborate, partner, or invite me to speak? Let's connect!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message_type" className="block text-gray-700 text-sm font-bold mb-2">
                  Message Type
                </label>
                <select
                  id="message_type"
                  name="message_type"
                  value={formData.message_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">General Inquiry</option>
                  <option value="speaking">Speaking Invitation</option>
                  <option value="collaboration">Collaboration</option>
                  <option value="media">Media Interview</option>
                  <option value="mentorship">Mentorship</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>

              {submitStatus === 'success' && (
                <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                  Message sent successfully! I'll get back to you soon.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                  Error sending message. Please try again.
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Let's Connect</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-4">📧</span>
                  <span className="text-gray-700">Available via contact form</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-600 mr-4">🌍</span>
                  <span className="text-gray-700">Based in Kenya</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-600 mr-4">🎤</span>
                  <span className="text-gray-700">Available for speaking engagements</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-600 mr-4">🤝</span>
                  <span className="text-gray-700">Open to partnerships and collaborations</span>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="text-lg font-bold text-gray-900 mb-4">Areas of Interest</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Human Rights</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Climate Action</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Digital Rights</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Youth Leadership</span>
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">Legal Education</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Benjamin Kyamoneka Mpey</h3>
          <p className="text-gray-300 mb-6">
            Empowering Youth. Defending Rights. Inspiring Change.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="#" className="text-gray-300 hover:text-white transition duration-300">
              LinkedIn
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition duration-300">
              Twitter
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition duration-300">
              Instagram
            </a>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">
              © 2025 Benjamin Kyamoneka Mpey. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
function App() {
  const [aboutData, setAboutData] = useState(null);
  const [leadershipData, setLeadershipData] = useState(null);
  const [achievementsData, setAchievementsData] = useState(null);
  const [eventsData, setEventsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutResponse, leadershipResponse, achievementsResponse, eventsResponse] = await Promise.all([
          axios.get(`${API}/portfolio/about`),
          axios.get(`${API}/portfolio/leadership`),
          axios.get(`${API}/portfolio/achievements`),
          axios.get(`${API}/portfolio/events`)
        ]);

        setAboutData(aboutResponse.data);
        setLeadershipData(leadershipResponse.data);
        setAchievementsData(achievementsResponse.data);
        setEventsData(eventsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <main>
          <HeroSection aboutData={aboutData} />
          <AboutSection aboutData={aboutData} />
          <LeadershipSection leadershipData={leadershipData} />
          <AchievementsSection achievementsData={achievementsData} />
          <EventsSection eventsData={eventsData} />
          <ContactSection />
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;