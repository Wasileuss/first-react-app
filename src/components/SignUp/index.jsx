import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react';

import { isUserLogin } from '../../store/isUserLogin';

import eyeHide from '../../assets/icons/eye-hide.svg';
import eyeShow from '../../assets/icons/eye-show.svg';

import './styles.css';

const SignUp = observer(() => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        password: '',
        passwordRepeat: '',
    });
    const [showPass, setShowPass] = useState(false);
    const [showPassRepeat, setShowPassRepeat] = useState(false);

    const regExpEmail = /^\S+@\S+\.\S+$/;
    
    const isEmailValid = userInfo.email.trim().match(regExpEmail) ? true : false;
    const isPassEqual = userInfo.password.length > 0 && userInfo.password === userInfo.passwordRepeat;
    
    const handleChangeInfo = (e) => {
        setUserInfo(userInfo => ({...userInfo, [e.target.name]: e.target.value}));
    };

    const isFormSubmit = isEmailValid && isPassEqual;

    const onSubmit = (e) => {
        e.preventDefault();

        localStorage.setItem("email", userInfo.email);
        localStorage.setItem("password", userInfo.password);

        isUserLogin.setUserLogin();
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
                {!isPassEqual && !!userInfo.password.length && 
                    <label htmlFor="email" className="login__password__label error">
                    Passwords not equal
                    </label>
                }
                <img
                    src={showPass ? eyeHide : eyeShow}
                    alt="show/hide password"
                    className="login__password__input__eye"
                    onClick={() => setShowPass(!showPass)}
                />
                </div>
                <div className="login__password-repeat">
                <label htmlFor="passwordRepeat" className="login__password-repeat__label">
                    Repeat password
                </label>
                <input
                    type={showPassRepeat ? "text" : "password"}
                    className="login__password-repeat__input"
                    name="passwordRepeat"
                    id="passwordRepeat"
                    value={userInfo.passwordRepeat}
                    onChange={handleChangeInfo}
                />
                {!isPassEqual && !!userInfo.passwordRepeat.length && 
                    <label htmlFor="email" className="login__password-repeat__label error">
                    Passwords not equal
                    </label>
                }
                <img
                    src={showPassRepeat ? eyeHide : eyeShow}
                    alt="show/hide password"
                    className="login__password__input__eye"
                    onClick={() => setShowPassRepeat(!showPassRepeat)}
                />
                </div>
                <input
                type="submit"
                value="SIgn Up"
                className="login__button"
                disabled={!isFormSubmit}
                />
                <div>
                    <Link to={"/authorization/login"}>
                        <span className="login__auth-switch">
                            Log In
                        </span>
                    </Link>
                </div>
            </form>
        </div>
    )
})

export default SignUp;
