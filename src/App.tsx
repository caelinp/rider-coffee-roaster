import React, { useState } from 'react';
import './App.css';
import './LandingPage.css';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import LandingPage from './LandingPage';



const App: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const closeDrawer = () => {
    setDrawerOpen(false);
  };
  return (
    <div className="App">
      <div className="menu-button" onClick={toggleDrawer}>
          <MenuIcon fontSize="large" />
        </div>
  
        <Drawer anchor="left" id="nav-drawer" open={drawerOpen} onClose={closeDrawer}>
          <List>
            <ListItem button onClick={closeDrawer}>
              <ListItemText primary="Products" />
            </ListItem>
            <ListItem button onClick={closeDrawer}>
              <ListItemText primary="About Us" />
            </ListItem>
            <ListItem button onClick={closeDrawer}>
              <ListItemText primary="Contact Us" />
            </ListItem>
          </List>
        </Drawer>
      <div className="black-bar left"></div>
      <div className="black-bar right"></div>
      <LandingPage />
    </div>
  );
};

export default App;
