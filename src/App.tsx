/* App.tsx */
import React, { useMemo, useState} from 'react';
import './App.css';
import './LandingPage.css';
import { Modal, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LandingPage from './LandingPage';
import AboutUsPage from './AboutUsPage';
import ContactUsPage from './ContactUsPage'; // Import the ContactUsPage component
import FeaturedProductsPage from './FeaturedProductsPage'; // Import the ContactUsPage component
import AllProductsPage from './AllProductsPage'; // Import the AllProductsPage component
import ProductInfoPage from './ProductInfoPage'; // Import the ProductInfoPage component
import ShoppingCartPage from './ShoppingCartPage';
import logo from "./img/icon-light-grey.png";
import shoppingCartIcon from "./img/shopping-cart.png";
import { selectCartItems } from './CartSlice';

const CartBadge: React.FC<{ count: number }> = ({ count }) => {
  // Check if the count is greater than 1000
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

  // Use the selectCartItems selector to get the cart items from the Redux store
  const cartItems = useSelector(selectCartItems);

  // Calculate the number of cart items
  const numberCartItems = useMemo(() => {
    // Use reduce to sum the quantity field of each item
    return cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
  }, [cartItems]); // Re-calculate when cartItems changes
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
        <Link to="/rider-coffee-roaster/">
          <img src={logo} alt="Rider Coffee Roaster Logo" className="logo-small" />
        </Link>
      </div>
      <div className="black-bar-side left"></div>
      <div className="menu-button" onClick={openModal}>
        <MenuIcon fontSize="large" id="menu-icon" />
      </div>

      <div className="black-bar-side right"></div>
      <div className="shopping-cart-button-container" id="shopping-cart-button-container">
        <Link to="/shopping-cart">
          <img src={shoppingCartIcon} alt="shopping cart button" id="shopping-cart-button" />
        </Link>
        <CartBadge count={numberCartItems} />
      </div>
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
