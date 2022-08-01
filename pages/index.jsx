import React from 'react';
import Header from '../components/header';
import Notification from '../components/notifications';
import styles from '../styles/Home.module.scss';
import Footer from '../components/footer';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header home />
      <Notification />
      <div className={styles.main}>
        <p>home</p>
      </div>
      <Footer />
    </div>
  );
}
