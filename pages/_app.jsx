/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import PreLoadContext from '../context/preLoadContext';
import NotificationsContext from '../context/notificationsContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const [preLoad, setPreLoad] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // add new notification
  const addNotification = (type, title, text, expire) => {
    const expires = expire === 'render' ? expire : `${Math.floor((new Date().getTime() + (parseFloat(expire) * 1000)) / 1000)}`;
    setNotifications([...notifications, {
      type, title, text, expires,
    }]);
  };
  return (
    <PreLoadContext.Provider value={{ preLoad, setPreLoad }}>
      <NotificationsContext.Provider value={{ notifications, setNotifications, addNotification }}>
        <Head>
          <title>memoCalendar</title>
        </Head>
        <Component {...pageProps} />
      </NotificationsContext.Provider>
    </PreLoadContext.Provider>
  );
}
export default MyApp;
MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.shape({}).isRequired,
};
