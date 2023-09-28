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
                <a href="/">Home</a>
                <a href="/featured-products/">Featured</a>
                <a href="/products/">Products</a>
                <a href="/about-us/">About Us</a>
                <a href="/contact-us/">Contact Us</a>
                <a href="/shopping-cart/">Your Cart</a>
            </div>
            <div className="copyright-and-logo">
                <Link to="/">
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

export default Footer
