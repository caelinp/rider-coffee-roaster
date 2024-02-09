import React from 'react';
import './ContactUsPage.css';
import Footer from './Footer';

const ContactUsPage: React.FC = () => {
  return (
    <div className="contact-us-page">
      <div className="contact-us-content-and-bottom">
        <div className="contact-us-content">
          <div className="contact-us-text-content">
            <h1 className="contact-us-header">Contact Us</h1>
            <div className="sub-section">
              <h2>Delivery Policy</h2>
              <p>We deliver to customers in Greater Vancouver every Sunday.</p>
              <p>Email us at <a href="mailto:info@ridercoffeeroaster.com">info@ridercoffeeroaster.com</a> or give us a call at <a href="tel:+6048173200">(604)-817-3200</a> for more information.</p>
            </div>
            <div className="sub-section">
              <h2>Business and Wholesale Inquiries</h2>
              <p>For business and wholesale inquiries, please email us at <a href="mailto:info@ridercoffeeroaster.com">info@ridercoffeeroaster.com</a> or give us a call at <a href="tel:+6048173200">(604)-817-3200</a>.</p>
              <p>We're excited to work with you!</p>
            </div>
          </div>
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default ContactUsPage;
