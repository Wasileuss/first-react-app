import React from 'react';
import { Link } from 'react-router-dom';
import 'animate.css';

import './home.css';

import logo from '../../assets/icons/logo-react.svg';
import bg from "../../assets/images/home-bg.webp";
import logo2 from "../../assets/icons/logo-cbs.png";



function Home() {
    return(
        <div className='home' style={{ background: `url(${bg})`, backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
            <h2 className="title  animate__animated animate__zoomInDown">About</h2>
            {/* <Title title="Home" /> */}
            <div className='home__container'>
                <div className='home__content'>
                    <div className='home__info animate__animated animate__backInRight'>
                        <p>Hello everyone!</p>
                        <p>My name is Vasyl Bezkorovainyi</p>
                        <p>I'd like to introduce you to my first React App.</p>
                        <p>Yes, it's not perfect! But I'm working on it. And you can see for yourself. Just recently I tried to display "Hello World! :)</p>
                        <p>And I did it all thanks to <span>CYBERBIONIC SYSTEMATICS</span> and my best mentor and friend <span>Said Bairam</span>.</p>
                    </div>
                        <Link className="home__logo2 animate__animated animate__fadeInLeft" to="https://edu.cbsystematics.com/ua" target="_blank">
                        <img className='home__svg' src={logo2} alt="logo" />
                    </Link>
                </div>
                <img src={logo} className="home__logo" alt="logo" />
            </div>
        </div>
    );
}

export default Home;