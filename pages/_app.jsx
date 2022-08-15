/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import AuthContext from '../context/authContext';
import PreLoadContext from '../context/preLoadContext';
import NotificationsContext from '../context/notificationsContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const initAuthDta = {
    user: {
      id: null,
      username: null,
      email: null,
    },
    token: null,
  };
  const [authData, setAuthData] = useState(initAuthDta);
  const [preLoad, setPreLoad] = useState(false);
  const [notifications, setNotifications] = useState([]);
  useEffect(() => {
    let sessionAuth = localStorage.getItem('auth');
    sessionAuth = JSON.parse(sessionAuth);
    if (sessionAuth) setAuthData(sessionAuth);
  }, []);
  const resetAuthData = () => {
    localStorage.removeItem('auth');
    setAuthData(initAuthDta);
  };

  // add new notification
  const addNotification = (type, title, text, expire) => {
    const expires = expire === 'render' ? expire : `${Math.floor((new Date().getTime() + (parseFloat(expire) * 1000)) / 1000)}`;
    setNotifications([...notifications, {
      type, title, text, expires,
    }]);
  };
  return (
    <AuthContext.Provider value={{ resetAuthData, authData, setAuthData }}>
      <PreLoadContext.Provider value={{ preLoad, setPreLoad }}>
        <NotificationsContext.Provider value={{ notifications, setNotifications, addNotification }}>
          <Head>
            <title>memoCalendar</title>
          </Head>
          <Component {...pageProps} />
        </NotificationsContext.Provider>
      </PreLoadContext.Provider>
    </AuthContext.Provider>
  );
}
export default MyApp;
export function removeCookies(key, value = null) {
  document.cookie = `${key}=${value}; expires=${new Date(0)}; path=/; SameSite=None; Secure`;
}
MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};
