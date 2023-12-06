// Header Component: Renders the header section of the Mind Mapping App.

import React from 'react';
import logo from '../Assets/logo.png'

const Header = () => {
  return (
    // JSX for rendering the Header component
    <div className="header">
      <img src={logo} alt="Logo" className="logo" />
      <h1 className='app-title'>Mind Mapping App</h1>
    </div>
  );
};

export default Header;
