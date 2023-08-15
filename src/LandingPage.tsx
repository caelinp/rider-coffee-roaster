import React, { useState } from 'react';
import './LandingPage.css';
import './App.css'
import FeaturedProducts from './FeaturedProducts';

import logo from './img/icon.png';

const LandingPage: React.FC = () => {
    const [showProducts, setShowProducts] = useState(false);
    const [contentVisible, setContentVisible] = useState(true);
  
    const showProductsHandler = () => {
      setShowProducts(true);
      setContentVisible(false);
    };
  
    return (
      <div className={`landing-page ${showProducts ? 'fade-out' : ''}`}>
        {contentVisible && (
          <div className="landing-content">
            <img src={logo} alt="Rider Coffee Roaster Logo" className="logo" />
            <h1 className="mantra">One for the ride</h1>
            <p className="mission">
              At Rider Coffee Roaster, we are dedicated to delivering the finest
              coffee experience to our customers. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit.
            </p>
            <button className="enter-button" onClick={showProductsHandler}>
              Enter
            </button>
          </div>
        )}
  
        {showProducts && <FeaturedProducts show={showProducts} />}
      </div>
    );
  };
  
  export default LandingPage;
  