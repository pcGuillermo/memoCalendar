/* eslint-disable linebreak-style */
import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import PreLoad from './preLoad';
import NotificationsContext from '../context/notificationsContext';
import styles from '../styles/Header.module.scss';

export default function Header({ home }) {
  const { notifications, setNotifications } = useContext(NotificationsContext);
  // remove temporary notifications when header is rendered
  useEffect(() => {
    if (notifications.length > 0) {
      for (let i = 0; i < notifications.length; i += 1) {
        if (notifications[i].expires === 'render') {
          const removeNotifications = [
            ...notifications.slice(0, i),
            ...notifications.slice(i + 1, notifications.length)];
          setNotifications(removeNotifications);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.header}>
      <div className={styles.header__container}>
        <Link href="/" passHref>
          <p className={styles.header__container_logo}>
            memoCalendar
          </p>
        </Link>
        {!home ? (
          <div className={styles.header__container_user}>
            <p className={styles.header__container_name}>Hector Guillermo Angeles Maicas</p>
            <p><span>memoangeles180@gmail.com</span></p>
          </div>
        ) : null}
      </div>
      <PreLoad />
    </div>
  );
}
Header.propTypes = {
  home: PropTypes.bool,
};
Header.defaultProps = {
  home: false,
};
