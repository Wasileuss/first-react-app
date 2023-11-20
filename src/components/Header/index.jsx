import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

import { navigation } from '../../data/navigation';
import { isUserLogin } from '../../store/isUserLogin';
import { BsBoxArrowRight } from "react-icons/bs";


import './styles.css';

const Navigation = () => {
    const logout = () => {
        localStorage.removeItem("email");
        localStorage.removeItem("password");

        isUserLogin.setUserLogout();
    }

    const [isActive, setIsActive] = useState(false);

    const handleBurgerClick = () => {
        setIsActive(!isActive);
    };

  return (
    <>
        <header className="header">
            <div className='header__container navigation'>
                <div className='header__title'>
                    <svg viewBox="0 0 260 100">
                        <text x="50%" y="50%" dy=".35em" textAnchor="middle">
                            React App
                        </text>
                    </svg>
                </div>

                <div className={`nav ${isActive ? 'active' : ''}`}>
                    <div className='nav__menu'>
                        <ul className={`nav__list list ${isActive ? 'active' : ''}`}  onClick={handleBurgerClick}>
                            {navigation.map(el => (
                            <li key={Math.random() * 100} className=''>
                                <NavLink
                                    to={el.link}
                                    className={({ isActive }) => isActive ? 'list__item--active' : "list__item"}>
                                    {el.pageName}
                                </NavLink>
                                </li>
                            ))}
                            <li className='list__icon' key='logout-key' onClick={logout} style={{ color: 'orange'}}>
                            <BsBoxArrowRight />
                            </li>
                        </ul>
                        <div className={`mobile ${isActive ? 'active' : ''}`}>
                            <div className={`mobile__burger ${isActive ? 'active' : ''}`} onClick={handleBurgerClick}>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </header>

      <div >
        
      </div>
    </>
  )
}

export default Navigation;
