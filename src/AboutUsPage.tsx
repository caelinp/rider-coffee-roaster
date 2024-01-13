import React from 'react';
import './AboutUsPage.css';
import image1 from './img/image1.jpg';
import image2 from './img/image2.jpg';
import Footer from './Footer';

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-us-page">
      <div className="about-us-content-and-bottom">
        <div className="about-us-content">
          <div className="about-us-text-content">
            <h1 className="about-us-header">About Us</h1>
            <p>Welcome to Rider Coffee Roasters, a haven for coffee enthusiasts who cherish every sip. Our journey is deeply rooted in the personal story of our founder and roaster, Johnny, who began his career as a film technician. Though his Scottish and Irish heritage was steeped in tea, through his journey, he found his true calling in the rich universe of coffee.</p>
            <h2>A Serendipitous Start in Venice</h2>
            <p>While wandering through Venice, Johnny sought advice on what to explore in the city. A local woman, sensing his curiosity, invited him in for a cappuccino. This wasn't just any coffee, but an experience that opened his eyes to the rich and complex world of coffee. It was his first sip of truly great coffee, and it sparked a passion that would change the course of his life.</p>
            <h2>Embarking on a Global Coffee Quest</h2>
            <p>Driven by this newfound passion, Johnny traveled through Brazil and Colombia, immersing himself in the art of coffee roasting. He then brought his global insights back to Vancouver, continuing to refine his skills and deepen his understanding of the coffee roasting process.</p>
            <h2>Johnny's Roasting Philosophy</h2>
            <p>Today, Johnny's approach to coffee roasting is a blend of art, science, and heart. He operates his own coffee roaster, focusing on small-batch craft coffee. This method ensures each batch is given the attention it deserves, bringing out the unique characteristics and flavors of every bean.</p>
            <h2>Direct Relationships with Farmers</h2>
            <p>A cornerstone of Johnny's philosophy is his direct relationship with coffee farmers. He has built friendships and partnerships with coffee growers around the world. This hands-on approach allows him to source the best beans directly from the people who grow them, ensuring not only quality but also fairness and sustainability in the coffee supply chain.</p>
            <h2>Crafting Coffee with Care and Connection</h2>
            <p>Johnny's winters are spent roasting with different artisans in Mexico, continually learning and adopting new techniques. This global perspective reinforces his commitment to producing exceptional coffee while respecting and supporting the coffee-growing communities.</p>
            <h2>Join Our Coffee Community</h2>
            <p>At Rider Coffee Roaster, we invite you to be a part of this extraordinary journey. Each cup of our coffee tells a story of passion, craftsmanship, and global connection. From the historic canals of Venice to the vibrant fields of South and Central America, and back to our local community in Vancouver, our coffee is a journey in every sip. Welcome to a world where coffee is more than a drink—it's an experience.</p>
            
            <br></br>
            <br></br>
            <br></br>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default AboutUsPage;
