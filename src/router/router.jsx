import { useEffect } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react';

import Login from '../components/Auth/Login';
import SignUp from '../components/Auth/SignUp';
import UserPage from '../pages/UserPage';
import UserInfo from '../components/UserProfile/UserInfo';
import Home from '../components/Home/Home';
import Todo from '../components/Todo/Todo';
import Note from '../components/Note/Note';
import Contact from '../components/Contact/Contact';
import Navigation from '../components/Header';
import Sidebar from '../components/Sidebar/Sidebar';
import Footer from '../components/Footer/Footer';
import Page404 from '../components/Page404/Page404';

import { auth } from '../store/auth';

import bg from '../assets/images/repeat-bg.webp';

/** Only for logged-in users; remembers where the visitor wanted to go. */
const RequireAuth = observer(() => {
  const location = useLocation();

  useEffect(() => {
    auth.checkSession();
  }, [location.pathname]);

  if (!auth.isAuthenticated) {
    return <Navigate to="/authorization/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
});

/** Login / sign-up pages: logged-in users are sent on to where they were going. */
const GuestOnly = observer(() => {
  const location = useLocation();
  if (auth.isAuthenticated) {
    const from = location.state?.from;
    const target = from?.pathname?.startsWith('/') && !from.pathname.startsWith('/authorization') ? from : '/home';
    return <Navigate to={target} replace />;
  }
  return <Outlet />;
});

const Routing = () => (
  <>
    <Navigation />
    <main className="main" style={{ background: `url(${bg})` }}>
      <Sidebar />
      <Routes>
        <Route element={<RequireAuth />}>
          <Route index element={<Navigate to="/home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="todo" element={<Todo />} />
          <Route path="note" element={<Note />} />
          <Route path="contact" element={<Contact />} />
          <Route path="profile" element={<UserPage />}>
            <Route path="info" element={<UserInfo />} />
          </Route>
        </Route>
        <Route path="authorization" element={<GuestOnly />}>
          <Route index element={<Navigate to="login" replace />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<SignUp />} />
        </Route>
        <Route path="*" element={<Page404 />} />
      </Routes>
    </main>
    <Footer />
  </>
);

export default Routing;
