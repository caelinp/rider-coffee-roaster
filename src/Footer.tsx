// Footer.tsx
import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';
import logo from './img/metal-logo.gif';

const Footer: React.FC = () => {
  return (
    <div className="black-bar-bottom">
      <div className="footer">
        <div className="footer-links">
          <Link to="/" className="footer-link">Home</Link>
          <Link to="/featured-products/" className="footer-link">Featured</Link>
          <Link to="/products/" className="footer-link">Products</Link>
          <Link to="/about-us/" className="footer-link">About Us</Link>
          <Link to="/contact-us/" className="footer-link">Contact Us</Link>
          <Link to="/shopping-cart/" className="footer-link">Your Cart</Link>
        </div>
        <div className="copyright-and-logo">
          <Link to="/" className="logo-footer-link">
            <img src={logo} alt="Rider Coffee Roaster Logo" className="logo-footer" />
          </Link>
          <div className="copyright">
            © 2023 Rider Coffee Roaster.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
