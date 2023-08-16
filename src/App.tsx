import React, { useState } from 'react';
import './App.css';
import './LandingPage.css';
import Modal from '@mui/material/Modal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import LandingPage from './LandingPage';

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleItemClick = () => {
    closeModal(); // Close the modal
    // Optionally, add more logic based on the item clicked
  };

  return (
    <div className="App">
      <div className="menu-button" onClick={openModal}>
        <MenuIcon fontSize="large" />
      </div>
      <Modal
        open={modalOpen}
        onClose={closeModal}
        className={modalOpen ? 'modal-open' : 'modal-closed'} // Apply the correct animation class
      >
        <div className="modal-content">
          <List className="modal-list">
            <ListItem className="modal-item" button onClick={handleItemClick}>
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem className="modal-item" button onClick={handleItemClick}>
              <ListItemText primary="About Us" />
            </ListItem>
            <ListItem className="modal-item" button onClick={handleItemClick}>
              <ListItemText primary="Contact Us" />
            </ListItem>
          </List>
        </div>
      </Modal>
      <div className="black-bar left"></div>
      <div className="black-bar right"></div>
      <LandingPage />
    </div>
  );
};

export default App;
