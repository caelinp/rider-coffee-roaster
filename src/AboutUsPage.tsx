import React from 'react';
import './AboutUsPage.css';
import image1 from './img/image1.jpg';
import image2 from './img/image2.jpg';

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-us-page">
      <div className="about-us-content">
        <h1>About Us</h1>
        <p>Welcome to Rider Coffee Roasters, a coffee roasting company born out of a shared passion for the perfect cup of coffee. Founded by friends Johnny and Daniel, Rider Coffee Roasters is a tribute to the rich history of coffee, a journey that took us from the heart of coffee plantations to the buzzing cafes of the world.</p>
        <img src={image1} alt="Image 1" className="content-image" />
        <p>Our story begins in the lush highlands of Colombia, where we first encountered the magic of coffee cultivation. The sight of coffee cherries ripening under the warm sun and the aroma of freshly brewed coffee captivated us. We knew we had to learn more, so we packed our bags and embarked on a global adventure to discover the secrets of coffee.</p>
        <h2>Our Story</h2>
        <p>From Colombia, we traveled to Ethiopia, the birthplace of coffee. Immersing ourselves in local traditions and cultures, we gained insights into the art of coffee harvesting, processing, and roasting. It was during this journey that Rider Coffee Roasters was born – a blend of our shared passion and dedication to crafting exceptional coffee.</p>
        <p>Back in our hometown, we set up our roastery with a commitment to sourcing the finest beans from around the world. We collaborate directly with farmers, ensuring ethical practices and sustainable partnerships. Our roasting process is a blend of science and art, where every bean is roasted to perfection, preserving its unique flavors and aromas.</p>
        <h2>Bean Sourcing</h2>
        <img src={image2} alt="Image 2" className="content-image" />
        <p>At Rider Coffee Roasters, we believe in sharing our love for coffee with the world. Whether you're a seasoned coffee aficionado or a curious newcomer, we invite you to join us on a journey of discovery. From bean to cup, our dedication to quality and authenticity shines through in every sip. Cheers to the perfect cup of coffee!</p>
      </div>
    </div>
  );
};

export default AboutUsPage;
