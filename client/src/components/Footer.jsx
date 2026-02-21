import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Jengo</h4>
            <p>Connecting volunteers with nonprofits to create meaningful impact.</p>
          </div>
          <div className="footer-section">
            <h4>For Volunteers</h4>
            <ul>
              <li><a href="/opportunities">Browse Opportunities</a></li>
              <li><a href="/#how-it-works">How It Works</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>For Nonprofits</h4>
            <ul>
              <li><a href="/login">Post Opportunity</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Jengo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
