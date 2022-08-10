import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
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
        <FullCalendar
          plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          nowIndicator
          locale="es"
          footerToolbar
          dayMaxEventRows
          editable
          initialEvents={[
            { title: 'nice event', start: new Date() },
          ]}
        />
      </div>
      <Footer />
    </div>
  );
}
