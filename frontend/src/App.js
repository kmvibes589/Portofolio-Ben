import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
    en: { home: "Home", about: "About", leadership: "Leadership", achievements: "Achievements", events: "Events", projects: "Projects", contact: "Contact" },
    fr: { home: "Accueil", about: "À propos", leadership: "Leadership", achievements: "Réalisations", events: "Événements", projects: "Projets", contact: "Contact" },
    ar: { home: "الرئيسية", about: "حول", leadership: "القيادة", achievements: "الإنجازات", events: "الأحداث", projects: "المشاريع", contact: "اتصل" },
    zh: { home: "首页", about: "关于", leadership: "领导力", achievements: "成就", events: "事件", projects: "项目", contact: "联系" },
    es: { home: "Inicio", about: "Acerca", leadership: "Liderazgo", achievements: "Logros", events: "Eventos", projects: "Proyectos", contact: "Contacto" }
  };

  const labels = navLabels[currentLang] || navLabels.en;

  return (
    <nav className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold text-gray-900">Benjamin Kyamoneka Mpey</span>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="#home" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.home}</a>
            <a href="#about" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.about}</a>
            <a href="#leadership" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.leadership}</a>
            <a href="#achievements" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.achievements}</a>
            <a href="#events" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.events}</a>
            <a href="#projects" className="nav-link text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium">{labels.projects}</a>
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
            <a href="#home" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.home}</a>
            <a href="#about" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.about}</a>
            <a href="#leadership" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.leadership}</a>
            <a href="#achievements" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.achievements}</a>
            <a href="#events" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.events}</a>
            <a href="#projects" className="block px-3 py-2 text-gray-700 hover:text-blue-600">{labels.projects}</a>
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
            <a href="#contact" className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 rounded-lg text-lg font-semibold transition duration-300">
              {currentLang === 'fr' ? 'Entrer en contact' :
               currentLang === 'ar' ? 'ابقى على تواصل' :
               currentLang === 'zh' ? '保持联系' :
               currentLang === 'es' ? 'Ponerse en contacto' : 'Get in Touch'}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// About Section Component
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

// Leadership Section Component
const LeadershipSection = ({ leadershipData, currentLang }) => {
  const sectionTitles = {
    en: { leadership: "Leadership & Advocacy", current: "Current Positions", past: "Past Positions" },
    fr: { leadership: "Leadership et Plaidoyer", current: "Postes actuels", past: "Postes précédents" },
    ar: { leadership: "القيادة والدعوة", current: "المناصب الحالية", past: "المناصب السابقة" },
    zh: { leadership: "领导力与倡导", current: "当前职位", past: "过往职位" },
    es: { leadership: "Liderazgo y Defensa", current: "Posiciones Actuales", past: "Posiciones Pasadas" }
  };

  const titles = sectionTitles[currentLang] || sectionTitles.en;

  return (
    <section id="leadership" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{titles.leadership}</h2>
          <div className="section-divider"></div>
        </div>

        {/* Current Positions */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">{titles.current}</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {leadershipData?.current_positions?.map((position, index) => (
              <div key={index} className="leadership-card leadership-card-current p-6 rounded-lg shadow-md card-hover">
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
          <h3 className="text-2xl font-bold text-gray-900 mb-8">{titles.past}</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {leadershipData?.past_positions?.map((position, index) => (
              <div key={index} className="leadership-card leadership-card-past p-6 rounded-lg shadow-md card-hover">
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
const AchievementsSection = ({ achievementsData, currentLang }) => {
  const sectionTitles = {
    en: { achievements: "Achievements & Recognition", fellowships: "🌍 International Fellowships", awards: "🏆 Awards & Recognition" },
    fr: { achievements: "Réalisations et Reconnaissance", fellowships: "🌍 Bourses Internationales", awards: "🏆 Prix et Reconnaissance" },
    ar: { achievements: "الإنجازات والاعتراف", fellowships: "🌍 الزمالات الدولية", awards: "🏆 الجوائز والاعتراف" },
    zh: { achievements: "成就与认可", fellowships: "🌍 国际奖学金", awards: "🏆 奖项与认可" },
    es: { achievements: "Logros y Reconocimiento", fellowships: "🌍 Becas Internacionales", awards: "🏆 Premios y Reconocimiento" }
  };

  const titles = sectionTitles[currentLang] || sectionTitles.en;

  return (
    <section id="achievements" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{titles.achievements}</h2>
          <div className="section-divider"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Fellowships */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{titles.fellowships}</h3>
            <div className="space-y-4">
              {achievementsData?.fellowships?.map((fellowship, index) => (
                <div key={index} className="achievement-card achievement-fellowship p-6 rounded-lg shadow-md card-hover">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{fellowship.title}</h4>
                  <p className="text-blue-600 font-semibold mb-1">{fellowship.organization}</p>
                  <p className="text-gray-600 text-sm mb-2">
                    {fellowship.year} {fellowship.location && `• ${fellowship.location}`}
                    {fellowship.dates && ` • ${fellowship.dates}`}
                  </p>
                  {fellowship.distinction && (
                    <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {fellowship.distinction}
                    </span>
                  )}
                  {fellowship.description && (
                    <p className="text-gray-600 text-sm mt-2">{fellowship.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{titles.awards}</h3>
            <div className="space-y-4">
              {achievementsData?.awards?.map((award, index) => (
                <div key={index} className="achievement-card achievement-award p-6 rounded-lg shadow-md card-hover">
                  <h4 className="text-lg font-bold text-gray-900 mb-2">{award.title}</h4>
                  <p className="text-blue-600 font-semibold mb-1">{award.organization}</p>
                  <p className="text-gray-600 text-sm">{award.year}</p>
                  {award.description && (
                    <p className="text-gray-600 text-sm mt-2">{award.description}</p>
                  )}
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
const EventsSection = ({ eventsData, currentLang }) => {
  const sectionTitles = {
    en: { events: "Events & Engagements", upcoming: "📅 Upcoming Events", past: "🎯 Past Events" },
    fr: { events: "Événements et Engagements", upcoming: "📅 Événements à venir", past: "🎯 Événements passés" },
    ar: { events: "الأحداث والمشاركات", upcoming: "📅 الأحداث القادمة", past: "🎯 الأحداث السابقة" },
    zh: { events: "活动与参与", upcoming: "📅 即将到来的活动", past: "🎯 过往活动" },
    es: { events: "Eventos y Compromisos", upcoming: "📅 Próximos Eventos", past: "🎯 Eventos Pasados" }
  };

  const titles = sectionTitles[currentLang] || sectionTitles.en;

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{titles.events}</h2>
          <div className="section-divider"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Upcoming Events */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{titles.upcoming}</h3>
            <div className="space-y-4">
              {eventsData?.upcoming_events?.map((event, index) => (
                <div key={index} className="event-card-upcoming p-6 rounded-lg shadow-md card-hover">
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
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{titles.past}</h3>
            <div className="space-y-4">
              {eventsData?.past_events?.map((event, index) => (
                <div key={index} className="event-card-past p-6 rounded-lg shadow-md card-hover">
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

// Projects Section Component
const ProjectsSection = ({ projectsData, currentLang }) => {
  const sectionTitles = {
    en: { projects: "Featured Projects & Work", explore: "🔗 Explore My Work" },
    fr: { projects: "Projets et Travaux en Vedette", explore: "🔗 Explorez mon travail" },
    ar: { projects: "المشاريع والأعمال المميزة", explore: "🔗 استكشف عملي" },
    zh: { projects: "特色项目与工作", explore: "🔗 探索我的工作" },
    es: { projects: "Proyectos y Trabajos Destacados", explore: "🔗 Explora mi trabajo" }
  };

  const titles = sectionTitles[currentLang] || sectionTitles.en;

  return (
    <section id="projects" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{titles.projects}</h2>
          <div className="section-divider"></div>
          <p className="text-gray-600 text-lg">{titles.explore}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projectsData?.featured_projects?.map((project, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md card-hover">
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">
                  {project.type === 'Education' ? '📚' :
                   project.type === 'Advocacy' ? '📢' :
                   project.type === 'Environment' ? '🌱' :
                   project.type === 'Research' ? '📊' :
                   project.type === 'Human Rights' ? '⚖️' : '🔗'}
                </span>
                <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded">
                  {project.type}
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h4>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
              >
                {currentLang === 'fr' ? 'Voir le projet' :
                 currentLang === 'ar' ? 'عرض المشروع' :
                 currentLang === 'zh' ? '查看项目' :
                 currentLang === 'es' ? 'Ver proyecto' : 'View Project'}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section Component
const ContactSection = ({ currentLang }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    message_type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  const sectionTitles = {
    en: {
      contact: "Get in Touch",
      subtitle: "Ready to collaborate, partner, or invite me to speak? Let's connect!",
      collaborate: "Let's Collaborate",
      areas: "Areas of Interest",
      name: "Name",
      email: "Email", 
      subject: "Subject",
      message: "Message",
      messageType: "Message Type",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent successfully! I'll get back to you soon.",
      error: "Error sending message. Please try again.",
      available: "Available via contact form",
      based: "Based in Kenya",
      speaking: "Available for speaking engagements",
      open: "Open to partnerships and collaborations"
    },
    fr: {
      contact: "Entrer en contact",
      subtitle: "Prêt à collaborer, partenaire ou m'inviter à parler? Connectons-nous!",
      collaborate: "Collaborons",
      areas: "Domaines d'intérêt",
      name: "Nom",
      email: "E-mail",
      subject: "Sujet", 
      message: "Message",
      messageType: "Type de message",
      send: "Envoyer le message",
      sending: "Envoi en cours...",
      success: "Message envoyé avec succès! Je vous recontacterai bientôt.",
      error: "Erreur lors de l'envoi du message. Veuillez réessayer.",
      available: "Disponible via le formulaire de contact",
      based: "Basé au Kenya",
      speaking: "Disponible pour des engagements de prise de parole",
      open: "Ouvert aux partenariats et collaborations"
    }
  };

  const labels = sectionTitles[currentLang] || sectionTitles.en;

  const messageTypes = {
    en: {
      general: "General Inquiry",
      speaking: "Speaking Invitation", 
      collaboration: "Collaboration",
      media: "Media Interview",
      mentorship: "Mentorship"
    },
    fr: {
      general: "Demande générale",
      speaking: "Invitation à parler",
      collaboration: "Collaboration", 
      media: "Interview média",
      mentorship: "Mentorat"
    }
  };

  const msgTypes = messageTypes[currentLang] || messageTypes.en;

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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{labels.contact}</h2>
          <div className="section-divider"></div>
          <p className="text-gray-600 text-lg">
            {labels.subtitle}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="contact-form p-8 rounded-lg shadow-lg">
              <div className="mb-6">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
                  {labels.name} *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                  {labels.email} *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message_type" className="block text-gray-700 text-sm font-bold mb-2">
                  {labels.messageType}
                </label>
                <select
                  id="message_type"
                  name="message_type"
                  value={formData.message_type}
                  onChange={handleChange}
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="general">{msgTypes.general}</option>
                  <option value="speaking">{msgTypes.speaking}</option>
                  <option value="collaboration">{msgTypes.collaboration}</option>
                  <option value="media">{msgTypes.media}</option>
                  <option value="mentorship">{msgTypes.mentorship}</option>
                </select>
              </div>

              <div className="mb-6">
                <label htmlFor="subject" className="block text-gray-700 text-sm font-bold mb-2">
                  {labels.subject} *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
                  {labels.message} *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="5"
                  className="form-input w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="form-button w-full text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:opacity-50"
              >
                {isSubmitting ? labels.sending : labels.send}
              </button>

              {submitStatus === 'success' && (
                <div className="status-success mt-4 p-4 rounded">
                  {labels.success}
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="status-error mt-4 p-4 rounded">
                  {labels.error}
                </div>
              )}
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg card-hover">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">{labels.collaborate}</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <span className="text-blue-600 mr-4">📧</span>
                  <span className="text-gray-700">{labels.available}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-600 mr-4">🌍</span>
                  <span className="text-gray-700">{labels.based}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-600 mr-4">🎤</span>
                  <span className="text-gray-700">{labels.speaking}</span>
                </div>
                
                <div className="flex items-center">
                  <span className="text-blue-600 mr-4">🤝</span>
                  <span className="text-gray-700">{labels.open}</span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-4">{labels.areas}</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="tag">Human Rights</span>
                  <span className="tag">Climate Action</span>
                  <span className="tag">Digital Rights</span>
                  <span className="tag">Youth Leadership</span>
                  <span className="tag">Legal Education</span>
                  <span className="tag">Gender Equality</span>
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
const Footer = ({ currentLang }) => {
  const footerLabels = {
    en: { 
      tagline: "Empowering Youth. Defending Rights. Inspiring Change.",
      copyright: "© 2025 Benjamin Kyamoneka Mpey. All rights reserved.",
      mission: "Thank you for exploring my portfolio. My mission is rooted in justice, equity, and sustainability. I'm open to collaborations in legal reform, youth empowerment, environmental justice, and human rights advocacy."
    },
    fr: {
      tagline: "Autonomiser la Jeunesse. Défendre les Droits. Inspirer le Changement.",
      copyright: "© 2025 Benjamin Kyamoneka Mpey. Tous droits réservés.",
      mission: "Merci d'avoir exploré mon portfolio. Ma mission est enracinée dans la justice, l'équité et la durabilité. Je suis ouvert aux collaborations en réforme juridique, autonomisation des jeunes, justice environnementale et défense des droits humains."
    }
  };

  const labels = footerLabels[currentLang] || footerLabels.en;

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Benjamin Kyamoneka Mpey</h3>
          <p className="text-gray-300 mb-6">{labels.tagline}</p>
          <p className="text-gray-400 max-w-3xl mx-auto mb-8">{labels.mission}</p>
          
          <div className="flex justify-center space-x-6 mb-8">
            <a href="https://linkedin.com/in/kyamoneka-mpey-benjamin" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition duration-300">
              LinkedIn
            </a>
            <a href="mailto:kyamompey@gmail.com" className="text-gray-300 hover:text-white transition duration-300">
              Email
            </a>
            <a href="tel:+254797427649" className="text-gray-300 hover:text-white transition duration-300">
              Phone
            </a>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm">{labels.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Main App Component
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
          <main>
            <HeroSection aboutData={aboutData} currentLang={currentLang} />
            <AboutSection aboutData={aboutData} currentLang={currentLang} />
            <LeadershipSection leadershipData={leadershipData} currentLang={currentLang} />
            <AchievementsSection achievementsData={achievementsData} currentLang={currentLang} />
            <EventsSection eventsData={eventsData} currentLang={currentLang} />
            <ProjectsSection projectsData={projectsData} currentLang={currentLang} />
            <ContactSection currentLang={currentLang} />
          </main>
          <Footer currentLang={currentLang} />
        </BrowserRouter>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;