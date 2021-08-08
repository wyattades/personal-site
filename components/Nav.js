import React from 'react';

import { NavLink } from 'components/Link';

const Nav = () => {
  return (
    <div className="nav-container">
      <nav className="nav">
        <ul>
          <li>
            <NavLink exact href="/">
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink href="/projects">
              <span>Projects</span>
            </NavLink>
          </li>
          <li>
            <NavLink exact href="/about">
              <span>About</span>
            </NavLink>
          </li>
          <li>
            <NavLink exact href="/contact">
              <span>Contact</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
