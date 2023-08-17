import React, { useState } from 'react';
import './App.css';
import './LandingPage.css';
import { Modal, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import AboutUsPage from './AboutUsPage';
import ContactUsPage from './ContactUsPage'; // Import the ContactUsPage component
//import ProductsPage from './ProductsPage'; // Import the ProductsPage component

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
            <ListItem className="modal-item" button onClick={() => handleItemClick('/')}>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem className="modal-item" button disabled> {/* Disable the "Products" button */}
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem className="modal-item" button onClick={() => handleItemClick('/about-us')}>
              <ListItemText primary="About Us" />
            </ListItem>
            <ListItem className="modal-item" button onClick={() => handleItemClick('/contact-us')}>
              <ListItemText primary="Contact Us" />
            </ListItem>
          </List>
        </div>
      </Modal>
      <div className="black-bar left"></div>
      <div className="black-bar right"></div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/products" element={<div />} /> {/* Route to the placeholder ProductsPage */}
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
      </Routes>
    </div>
  );
};

export default App;
