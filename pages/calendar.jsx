import React from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import Header from '../components/header';
import Notification from '../components/notifications';
import styles from '../styles/Calendar.module.scss';

export default function Home() {
  console.log(new Date());
  return (
    <div className={styles.container}>
      <Header home />
      <Notification />
      <div className={styles.main}>
        <FullCalendar
          plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          locale="es"
          dayMaxEventRows
          editable
          eventClick={
            (info) => {
              // eslint-disable-next-line no-console
              console.log(info.event);
            }
          }
          initialEvents={[
            { title: 'nice event', start: '2022-08-11T05:49:42.746Z', backgroundColor: 'red' },
            { title: 'nice event', start: new Date(), backgroundColor: 'red' },
          ]}
        />
      </div>
    </div>
  );
}
