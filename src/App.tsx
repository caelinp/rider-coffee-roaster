import React, { useMemo, useState, useEffect } from 'react';
import './App.css';
import './LandingPage.css';
import { Modal, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './LandingPage';
import AboutUsPage from './AboutUsPage';
import ContactUsPage from './ContactUsPage';
import FeaturedProductsPage from './FeaturedProductsPage';
import AllProductsPage from './AllProductsPage';
import ProductInfoPage from './ProductInfoPage';
import ShoppingCartPage from './ShoppingCartPage';
import logo from "./img/icon-light-grey.png";
import shoppingCartIcon from "./img/shopping-cart.png";
import { selectCartItems } from './CartSlice';

const CartBadge: React.FC<{ count: number }> = ({ count }) => {
  const displayCount = count > 1000 ? '1000+' : count.toString();

  if (count > 0) {
    return <div className="cart-badge">{displayCount}</div>;
  }
  return null;
};

const App: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

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

  const cartItems = useSelector(selectCartItems);

  const numberCartItems = useMemo(() => {
    return cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
  }, [cartItems]);

  // Handle viewport height adjustments
  const adjustViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.body.style.transform = 'scale(1)';
  };

  useEffect(() => {
    adjustViewportHeight(); // Initial adjustment
    window.addEventListener('resize', adjustViewportHeight);
    window.addEventListener('focusin', adjustViewportHeight);
    window.addEventListener('focusout', adjustViewportHeight);

    return () => {
      window.removeEventListener('resize', adjustViewportHeight);
      window.removeEventListener('focusin', adjustViewportHeight);
      window.removeEventListener('focusout', adjustViewportHeight);
    };
  }, []);

  return (
    <div className="App">
      <Modal
        open={modalOpen}
        onClose={closeModal}
        className={modalOpen ? 'modal-open' : 'modal-closed'}
      >
        <div className="modal-content">
          <br></br>
          <br></br>
          <br></br>
          <List className="modal-list">
            <ListItem className="modal-item" onClick={() => handleItemClick('/')}>
              <ListItemText className="modal-item-text" primary="Home" />
            </ListItem>
            <ListItem className="modal-item" onClick={() => handleItemClick('/featured-products/')}>
              <ListItemText className="modal-item-text" primary="Featured" />
            </ListItem>
            <ListItem className="modal-item" onClick={() => handleItemClick('/products/')}>
              <ListItemText className="modal-item-text" primary="Products" />
            </ListItem>
            <ListItem className="modal-item" onClick={() => handleItemClick('/about-us/')}>
              <ListItemText className="modal-item-text" primary="About Us" />
            </ListItem>
            <ListItem className="modal-item" onClick={() => handleItemClick('/contact-us/')}>
              <ListItemText className="modal-item-text" primary="Contact Us" />
            </ListItem>
            <ListItem className="modal-item" id="cart-modal-item" onClick={() => handleItemClick('/shopping-cart/')}>
              <ListItemText className="modal-item-text" primary="Your Cart" />
            </ListItem>
          </List>
        </div>
      </Modal>
      <div className="black-bar-top">
        <div className="menu-button" onClick={openModal}>
          <MenuIcon fontSize="large" id="menu-icon" />
        </div>
        <Link to="/rider-coffee-roaster/">
          <img src={logo} alt="Rider Coffee Roaster Logo" className="logo-small" />
        </Link>
        <div className="shopping-cart-button-container" id="shopping-cart-button-container">
          <Link to="/shopping-cart">
            <img src={shoppingCartIcon} alt="shopping cart button" id="shopping-cart-button" />
          </Link>
          <CartBadge count={numberCartItems} />
        </div>
      </div>
      <div className="black-bar-side left"></div>
      <div className="black-bar-side right"></div>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/shopping-cart" element={<ShoppingCartPage/>} />
        <Route path="/products" element={<AllProductsPage />} /> 
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/featured-products" element={<FeaturedProductsPage />} />
        <Route path="/products/:id/:productName" element={<ProductInfoPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
