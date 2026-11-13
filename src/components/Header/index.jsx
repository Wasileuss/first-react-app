import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';
import { BsBoxArrowRight } from 'react-icons/bs';

import { navigation } from '../../data/navigation';
import { auth } from '../../store/auth';

import './styles.css';

const MENU_ID = 'main-menu';

const Navigation = observer(() => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Close the mobile menu after navigating (also covers back/forward).
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  // Lock page scroll and allow Escape while the mobile menu is open.
  useEffect(() => {
    if (!menuOpen) return undefined;
    document.documentElement.classList.add('lock');
    const onKey = (event) => event.key === 'Escape' && setMenuOpen(false);
    document.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.classList.remove('lock');
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const logout = () => {
    setMenuOpen(false);
    auth.logout();
  };

  return (
    <header className="header">
      <div className="header__container navigation">
        <div className="header__title">
          <svg className="header__logo" viewBox="0 0 260 100" role="img" aria-label="React App">
            <text x="50%" y="50%" dy=".35em" textAnchor="middle">
              React App
            </text>
          </svg>
        </div>

        {auth.isAuthenticated && (
          <nav className={`nav ${menuOpen ? 'active' : ''}`} aria-label="Main">
            <div className="nav__menu">
              <ul id={MENU_ID} className={`nav__list list ${menuOpen ? 'active' : ''}`}>
                {navigation.map((item) => (
                  <li key={item.link}>
                    <NavLink
                      to={item.link}
                      className={({ isActive }) => (isActive ? 'list__item--active' : 'list__item')}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.pageName}
                    </NavLink>
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    className="list__icon"
                    onClick={logout}
                    aria-label={`Log out (${auth.user.email})`}
                    title={`Log out (${auth.user.email})`}
                  >
                    <BsBoxArrowRight aria-hidden="true" />
                  </button>
                </li>
              </ul>
              <div className={`mobile ${menuOpen ? 'active' : ''}`}>
                <button
                  type="button"
                  className={`mobile__burger ${menuOpen ? 'active' : ''}`}
                  aria-expanded={menuOpen}
                  aria-controls={MENU_ID}
                  aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                  onClick={() => setMenuOpen((open) => !open)}
                >
                  <span />
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
});

export default Navigation;
