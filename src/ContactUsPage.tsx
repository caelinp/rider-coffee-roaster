// ContactUsPage.tsx
import React from 'react';
import './ContactUsPage.css';

const ContactUsPage: React.FC = () => {
  return (
    <div className="contact-us-page">
      <div className="contact-us-content-and-bottom">
        <div className="contact-us-content">
          <h1 className="contact-us-header">Contact Us</h1>
          <br></br>
          <br></br>
          <div className="sub-section">
            <h2>Delivery Policy</h2>
            <p>We deliver to customers in Greater Vancouver every Friday.</p>
            <p>Contact us at delivery@ridercoffee.com for more information.</p>
          </div>
          <div className="sub-section">
            <h2>Business and Wholesale Inquiries</h2>
            <p>For business inquiries, please contact us at business@ridercoffee.com.</p>
            <p>We're excited to work with you!</p>
          </div>
          
        </div>
        <div className="black-bar-bottom"></div>
      </div>
    </div>
  );
};

export default ContactUsPage;
