import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../assets/jengologo.png';

const Home = () => {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <img src={logo} alt="Jengo" className="hero-logo" />
          <p className="hero-subtitle">
            Find volunteer tasks. Get accepted. Earn hours and experience.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">
              Volunteers
            </Link>
            <Link to="/register?role=nonprofit" className="btn btn-secondary">
              Nonprofits
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section" id="how-it-works">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="steps-container">
            <div className="step step-1">
              <div className="step-number">1</div>
              <h3>Sign Up</h3>
              <p>Create your account as a volunteer or nonprofit</p>
            </div>
            <div className="step step-2">
              <div className="step-number">2</div>
              <h3>Explore</h3>
              <p>Browse opportunities that match your goals</p>
            </div>
            <div className="step step-3">
              <div className="step-number">3</div>
              <h3>Apply & Connect</h3>
              <p>Apply instantly and start conversations</p>
            </div>
            <div className="step step-4">
              <div className="step-number">4</div>
              <h3>Impact & Track</h3>
              <p>Volunteer and earn hours and achievements</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2>Ready to Make a Difference?</h2>
          <p>Join hundreds of volunteers and nonprofits making an impact</p>
          <Link to="/register" className="btn btn-primary btn-large">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
