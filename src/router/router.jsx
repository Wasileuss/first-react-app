import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { observer } from 'mobx-react';

import Login from '../components/Login';
import SignUp from '../components/SignUp';
import Layout from '../pages/Layout';
import UserPage from '../pages/UserPage';
import UserInfo from '../components/UserProfile/UserInfo';
import AuthorizationPage from '../pages/AuthorizationPage';
import Home from '../components/Home/Home';
import Todo from '../components/Todo/Todo';
import Note from '../components/Note/Note';
import Contact from '../components/Contact/Contact';
import Navigation from '../components/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import Page404 from '../components/Page404/Page404';

import { users } from '../data/users';
import { isUserLogin } from '../store/isUserLogin';

import '../index.css';
import bg from "../assets/images/repeat-bg.webp";

const Routing = observer(() => {
    useEffect(() => {
        const email = localStorage.getItem("email");
        const password = localStorage.getItem("password");
        
        users[email] === password && isUserLogin.setUserLogin();
    }, [])

    return (
        <>
            <Navigation />
            <main className='main' style={{background: `url(${bg})`}}>
                <Sidebar />
                <Routes>
                    <Route element={isUserLogin.isUserLogin ? <Layout /> : <Navigate to={"/authorization/login"} />} path="/">
                        <Route element={<UserPage />} path="/profile">
                            <Route element={<UserInfo />} path="/profile/info" />
                        </Route>
                        <Route element={<Home />} path="/home" />
                        <Route element={<Todo />} path="/todo" />
                        <Route element={<Note />} path="/note" />
                        <Route element={<Contact />} path="/contact" />
                    </Route>
                    <Route element={!isUserLogin.isUserLogin ? <AuthorizationPage /> : <Navigate to={"/profile"} />} path="/authorization">
                        <Route element={<Login />} path="/authorization/login"/>
                        <Route element={<SignUp />} path="/authorization/signup"/>
                    </Route>
                    <Route element={<Page404 />} path="*"/>
                </Routes>
            </main>
            <Footer />
        </>
    );
})

export default Routing;
