import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ReactTyped } from "react-typed";
import './Home.css';

// QuickLinkCard component so that we can reuse it for each quick link
const QuickLinkCard = ({ icon, title, description, linkTo, buttonText }) => (
    <div className="col-md-4 mb-4">
      <div className="quick-link-card">
        <div className="card-body text-center">
          <i className={`fas ${icon} fa-3x mb-3`}></i>
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{description}</p>
          <Link to={linkTo} className="btn btn-primary">
            {buttonText}
          </Link>
        </div>
      </div>
    </div>
  );

function Home() {
  const [news, setNews] = useState([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const apiKey = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('https://finnhub.io/api/v1/news?category=general&token='+apiKey);
        const data = await response.json();
        setNews(data.slice(0, 25));
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();

    const interval = setInterval(() => {
      setActiveSlide(current => (current + 1) % (news.length || 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [apiKey, news.length]);

  const quickLinks = [
    {
      icon: 'fa-sign-in-alt',
      title: 'Sign Up',
      description: 'Get your personalized dashboard',
      linkTo: '/signup',
      buttonText: 'Sign Up'
    },
    {
      icon: 'fa-chart-line',
      title: 'Portfolio',
      description: 'View & track your investment portfolio',
      linkTo: '/portfolio',
      buttonText: 'View Portfolio'
    },
    {
      icon: 'fa-plus-circle',
      title: 'Add Stock',
      description: 'Add new stocks to your portfolio',
      linkTo: '/addStock',
      buttonText: 'Add Stock'
    }
  ];

  return (
    <div className="home-page">
      {/* Display of hero section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="welcome-text">
            <h1>
              <ReactTyped
                strings={["Welcome to holdSmart!"]}
                typeSpeed={100}
                backDelay={5000}
                backSpeed={20}
                loop={true}
              />
            </h1>
            <p className="subtitle">A Stock Portfolio Tracker</p>
            <p className="description">
              Track your investments, stay updated with market trends, and make informed decisions 
              with our comprehensive stock portfolio tracker app.
            </p>
          </div>
        </div>
      </section>

      {/* Display of quick links */}
      <section className="quick-links-section">
          <div className="section-header">
            <h2>Quick Links</h2>
            <div className="section-divider"></div>
          </div>
          <div className="row">
            {quickLinks.map((link, index) => (
              <QuickLinkCard key={index} {...link} />
            ))}
          </div>
      </section>

      {/* Display of stock related news */}
      <section className="news-section">
          <div className="section-header">
            <h2>Latest Market News</h2>
            <div className="section-divider"></div>
          </div>
          <div className="news-carousel-container">
            <div id="newsCarousel" className="carousel slide" data-bs-ride="carousel">
              <div className="carousel-inner">
                {news.map((item, index) => (
                  <div className={`carousel-item ${index === activeSlide ? 'active' : ''}`} key={index}>
                    <div className="news-card">
                      <div className="card-body">
                        <span className="news-date">
                          <i className="far fa-calendar-alt me-2"></i>
                          {new Date(item.datetime * 1000).toLocaleDateString()}
                        </span>
                        <h5 className="card-title">{item.headline}</h5>
                        <p className="card-text">{item.summary}</p>
                        <div className="card-footer">
                          <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                            Read Full Article
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
      </section>
    </div>
  );
}

export default Home;