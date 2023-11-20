import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import { users } from '../../data/users';
import { isUserLogin } from '../../store/isUserLogin';

import eyeHide from '../../assets/icons/eye-hide.svg';
import eyeShow from '../../assets/icons/eye-show.svg';

import './styles.css';

const Login = observer(() => {
    const [userInfo, setUserInfo] = useState({ email: '', password: ''})
    const [showPass, setShowPass] = useState(false);

    const regExpEmail = /^\S+@\S+\.\S+$/;
    
    const isEmailValid = userInfo.email.trim().match(regExpEmail) ? true : false;
    
    const handleChangeInfo = (e) => {
        setUserInfo(userInfo => ({...userInfo, [e.target.name]: e.target.value}));
    };

    const isFormSubmit = userInfo.email !== '' && userInfo.password !== '';

    const loginFunc = () => {
        localStorage.setItem("email", userInfo.email);
        localStorage.setItem("password", userInfo.password);

        isUserLogin.setUserLogin();
    }

    const onSubmit = (e) => {
        e.preventDefault();

        users[userInfo.email] === userInfo.password && loginFunc();
    }

    return (
        <div className="login">
            <form className="login__form" onSubmit={onSubmit}>
                <div className="login__email">
                    <label htmlFor="email" className="login__email__label">
                        Email
                    </label>
                <input
                    type="email"
                    className="login__email__input"
                    name="email"
                    id="email"
                    value={userInfo.email}
                    onChange={handleChangeInfo}
                />
                {!isEmailValid && !!userInfo.email.length && 
                    <label htmlFor="email" className="login__email__label error">
                    Email is not valid
                    </label>
                }
                </div>
                <div className="login__password">
                    <label htmlFor="password" className="login__password__label">
                        Password
                    </label>
                    <input
                        type={showPass ? "text" : "password"}
                        className="login__password__input"
                        name="password"
                        id="password"
                        value={userInfo.password}
                        onChange={handleChangeInfo}
                    />
                    <img
                        src={showPass ? eyeHide : eyeShow}
                        alt="show/hide password"
                        className="login__password__input__eye"
                        onClick={() => setShowPass(!showPass)}
                    />
                </div>
                <input
                type="submit"
                value="Login"
                className="login__button"
                disabled={!isFormSubmit}
                />
                <div>
                    <Link to={"/authorization/signup"}>
                        <span className="login__auth-switch">
                            Go Sign Up
                        </span>
                    </Link>
                </div>
            </form>
        </div>
    )
})

export default Login;
