import React from 'react';
import { NavLink } from 'react-router-dom';

const NavPage = () => {
  return (
    <div className="nav">
      <NavLink to="/" exact activeClassName="active-link">
        Home
      </NavLink>
      <NavLink to="/report" activeClassName="active-link">
        View Report
      </NavLink>
      {/* Add more NavLink components for other routes as needed */}
    </div>
  );
};

export default NavPage;
