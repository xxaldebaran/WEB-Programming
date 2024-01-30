import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import MainHeader from './MainHeader';
import NavLinks from './NavLinks';
import SideDrawer from './SideDrawer';
import Backdrop from '../UIElements/Backdrop';
import './MainNavigation.css';

const MainNavigation = props => {
  //state to manage whether the side drawer is open or closed
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

   //event handler to open the side drawer
  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  //event handler to close the side drawer
  const closeDrawerHandler = () => {
    setDrawerIsOpen(false);
  };

  return (
    <React.Fragment>
      {/*render the backdrop if the side drawer is open */}
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
       {/*render the side drawer */}
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>

      {/*render the main header */}
      <MainHeader>
        {/*button to open the side drawer */}
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <Link to="/">CertifyNet</Link>
        </h1>
        {/*render the navigation links in the main header */}
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
      
    </React.Fragment>
  );
};

export default MainNavigation;
