import React, { useState } from 'react';
import Header from '../components/header';
import Notification from '../components/notifications';
import styles from '../styles/Home.module.scss';
import Footer from '../components/footer';
import SignIn from '../components/signIn';
import SignUp from '../components/signUp';

export default function Home() {
  const [sign, setSign] = useState(true);
  return (
    <div className={styles.container}>
      <Header home />
      <Notification />
      <div className={styles.main}>
        <div className={styles.topControls}>
          <button type="button" className={!sign ? styles.topControls__desactive : null} onClick={() => setSign(true)}>Iniciar sesion</button>
          <button type="button" className={sign ? styles.topControls__desactive : null} onClick={() => setSign(false)}>Crear sesion</button>
        </div>
        <div className={styles.sign}>
          {sign ? (<SignIn />) : (<SignUp />)}
        </div>
      </div>
      <Footer />
    </div>
  );
}
