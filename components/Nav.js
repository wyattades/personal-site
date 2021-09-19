import React from 'react';
import { IoSunny, IoMoon, MdSettingsBrightness } from '@react-icons';

import { NavLink } from 'components/Link';
import { useTheme } from 'components/StyleTheme';

const themeIcons = {
  light: IoSunny,
  dark: IoMoon,
  system: MdSettingsBrightness,
};

const StyleThemeButton = () => {
  const theme = useTheme();

  const ThemeIcon = themeIcons[theme.mode] || themeIcons.light;

  return (
    <button
      className="button-reset nav-item"
      onClick={theme.toggleMode}
      style={{ width: 56 }} // same as height
      aria-label="Toggle theme"
      title={`Toggle ${theme.mode} theme`}
    >
      <span>&nbsp;</span>

      <i
        style={{
          padding: '2px 0',
          transition: 'transform 300ms ease',
          transform: `scaleX(${theme.changeCount % 2 === 0 ? 1 : -1})`,
        }}
      >
        <ThemeIcon size="1.5rem" />
      </i>

      <span>{theme.mode}</span>

      <style jsx>{`
        span {
          font-size: 0.5rem;
          color: var(--help-text-color);
          letter-spacing: 0.5px;
          font-weight: 600px;
          text-transform: capitalize;
          transition: opacity 300ms ease;
          opacity: 0;
        }
        button:hover span {
          opacity: 1;
        }
      `}</style>
    </button>
  );
};

const Nav = () => {
  return (
    <div className="nav-container">
      <nav className="nav">
        <ul>
          <li>
            <NavLink exact href="/" className="nav-item">
              <span>Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink href="/projects" className="nav-item">
              <span>Projects</span>
            </NavLink>
          </li>
          <li>
            <NavLink exact href="/about" className="nav-item">
              <span>About</span>
            </NavLink>
          </li>
          <li>
            <NavLink exact href="/contact" className="nav-item">
              <span>Contact</span>
            </NavLink>
          </li>
          <li>
            <StyleThemeButton />
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
