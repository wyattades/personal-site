import { NavLink } from "~/components/link";
import { ThemeSelector } from "~/components/theme-selector";

export const Nav = () => {
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
            <NavLink href="/blog" className="nav-item">
              <span>Blog</span>
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
            <ThemeSelector />
          </li>
        </ul>
      </nav>
    </div>
  );
};
