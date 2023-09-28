import React, { useMemo, useState } from 'react';
import './App.css';
import './LandingPage.css';
import { Drawer, List, ListItem, ListItemText } from '@mui/material';
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const openDrawer = () => {
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const handleItemClick = (newPath: string) => {
    closeDrawer();
    navigate(newPath);
  };

  const cartItems = useSelector(selectCartItems);

  const numberCartItems = useMemo(() => {
    return cartItems.reduce((total: number, item: any) => total + item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="App">
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={closeDrawer}
        className={drawerOpen ? 'nav-drawer drawer-open' : 'nav-drawer drawer-closed'}
      >
        <div className="drawer-content">
          <List className="drawer-list">
            <ListItem className="drawer-item" onClick={() => handleItemClick('/')}>
              <ListItemText className="drawer-item-text" primary="Home" />
            </ListItem>
            <ListItem className="drawer-item" onClick={() => handleItemClick('/featured-products/')}>
              <ListItemText className="drawer-item-text" primary="Featured" />
            </ListItem>
            <ListItem className="drawer-item" onClick={() => handleItemClick('/products/')}>
              <ListItemText className="drawer-item-text" primary="Products" />
            </ListItem>
            <ListItem className="drawer-item" onClick={() => handleItemClick('/about-us/')}>
              <ListItemText className="drawer-item-text" primary="About Us" />
            </ListItem>
            <ListItem className="drawer-item" onClick={() => handleItemClick('/contact-us/')}>
              <ListItemText className="drawer-item-text" primary="Contact Us" />
            </ListItem>
            <ListItem className="drawer-item" id="cart-drawer-item" onClick={() => handleItemClick('/shopping-cart/')}>
              <ListItemText className="drawer-item-text" primary="Your Cart" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <div className="black-bar-top">
        <div className="menu-button" onClick={openDrawer}>
          <MenuIcon fontSize="large" id="menu-icon" />
        </div>
        <Link to="/">
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
