import React, { useState } from 'react';
import './App.css';
import './LandingPage.css';
import { Modal, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import AboutUsPage from './AboutUsPage';
import ContactUsPage from './ContactUsPage'; // Import the ContactUsPage component
import FeaturedProductsPage from './FeaturedProductsPage'; // Import the ContactUsPage component
import AllProductsPage from './AllProductsPage'; // Import the AllProductsPage component
import ProductInfoPage from './ProductInfoPage'; // Import the ProductInfoPage component
import logo from "./img/icon-light-grey.png";
const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  const { path } = useParams();

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleItemClick = (newPath: string) => {
    closeModal();
    navigate(newPath);
  };

  return (
    <div className="App">
      <div className="menu-button" onClick={openModal}>
        <MenuIcon fontSize="large" />
      </div>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        className={modalOpen ? 'modal-open' : 'modal-closed'}
      >
        <div className="modal-content">
          <List className="modal-list">
            <ListItem className="modal-item" onClick={() => handleItemClick('/')}>
              <ListItemText className="modal-item-text" primary="Home" />
            </ListItem>
            <ListItem className="modal-item" onClick={() => handleItemClick('/products')}>
              <ListItemText className="modal-item-text" primary="Products" />
            </ListItem>
            <ListItem className="modal-item" onClick={() => handleItemClick('/about-us')}>
              <ListItemText className="modal-item-text" primary="About Us" />
            </ListItem>
            <ListItem className="modal-item" onClick={() => handleItemClick('/contact-us')}>
              <ListItemText className="modal-item-text" primary="Contact Us" />
            </ListItem>
          </List>
        </div>
      </Modal>
      <div className="black-bar-top">
        <Link to="/">
          <img src={logo} alt="Rider Coffee Roaster Logo" className="logo-small" />
        </Link>
      </div>
      <div className="black-bar-side left"></div>
      <div className="black-bar-side right"></div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/rider-coffee-roaster" element={<LandingPage />} />
        <Route path="/products" element={<AllProductsPage />} /> 
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/featured-products" element={<FeaturedProductsPage />} />
        <Route path="/sample-product" element={<ProductInfoPage />} />
      </Routes>
    </div>
  );
};

export default App;
