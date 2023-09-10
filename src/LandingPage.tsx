import React, { useState, useEffect } from 'react';
import './LandingPage.css';
import './App.css';
import FeaturedProducts from './FeaturedProductsPage';
import { Link } from 'react-router-dom'; // Import Link

import logo from './img/icon-with-text.png';

const LandingPage: React.FC = () => {

  useEffect(() => {
    // Delay before showing the logo
    const logoTimeout = setTimeout(() => {
      const logoElement = document.querySelector('.logo');
      if (logoElement) {
        logoElement.classList.add('show');
      }
    }, 200); // Adjust the delay as needed

    // Delay before showing the mantra
    const mantraTimeout = setTimeout(() => {
      const mantraElement = document.querySelector('.mantra');
      if (mantraElement) {
        mantraElement.classList.add('show');
      }
    }, 1000); // Adjust the delay as needed

    // Delay before showing the missions
    const missionDelays = [1500, 2500, 3500, 4500]; // Adjust the delays as needed
    for (let i = 0; i < missionDelays.length; i++) {
      const missionTimeout = setTimeout(() => {
        const missionElement = document.querySelector(`.mission${i}`);
        if (missionElement) {
          missionElement.classList.add('show');
        }
      }, missionDelays[i]);
    }

    // Delay before showing the enter button
    const enterButtonTimeout = setTimeout(() => {
      const enterButton = document.querySelector('.enter-button');
      if (enterButton) {
        enterButton.classList.add('show');
      }
    }, 5000); // Adjust the delay as needed

    return () => {
      clearTimeout(logoTimeout);
      clearTimeout(mantraTimeout);
      missionDelays.forEach((delay) => clearTimeout(delay));
      clearTimeout(enterButtonTimeout);
    };
  }, []);

  return (
    <div className={`landing-page`}>
      {
        <div className="landing-content">
          <img src={logo} alt="Rider Coffee Roaster Logo" className="logo" />
          <h1 className="mantra">One for the ride</h1>
          <p className="mission0">
            Great coffee doesn’t have to be difficult.
          </p>
          <p className="mission1">
            Rider Coffee Roaster believes in making specialty coffee accessible to every lifestyle. We roast highly traceable specialty grade coffee in a way that reflects the novelty of its origin. Our roast profiles are thoughtfully developed to meet the diverse palette of today’s coffee drinker. Commited to building sustainable relationships from farm to cup, we exist to link growers of exceptional coffee with the diverse community of coffee lovers.
          </p>
          <p className="mission2">
            We love culture and community.
          </p>
          <p className="mission3">
            Coffee is culture and community.
          </p>
          <Link to="/rider-coffee-roaster/featured-products">
            <button className="enter-button">Enter</button>
          </Link>
        </div>
      }
    </div>
  );
};

export default LandingPage;
