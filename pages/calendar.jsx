/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ReactModal from 'react-modal';
import moment from 'moment-timezone';
import 'moment/locale/es-mx';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import dayGridPlugin from '@fullcalendar/daygrid';
import AuthContext from '../context/authContext';
import { removeCookies } from './_app';
import Header from '../components/header';
import Notification from '../components/notifications';
import styles from '../styles/Calendar.module.scss';

export async function getServerSideProps({ req }) {
  const token = req.cookies.token || null;
  if (token === null) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: { token } };
}
export default function Home() {
  const router = useRouter();
  const { resetAuthData } = useContext(AuthContext);
  const [modal, setModal] = useState(false);
  const [fixEvent, setfixEvent] = useState(
    {
      title: '',
      backgroundColor: '',
      startYear: '',
      startMonth: '',
      startDay: '',
      startHours: '',
      startMinutes: '',
      endYear: '',
      endMonth: '',
      endDay: '',
      endHours: '',
      endMinutes: '',
    },
  );
  const [event, setEvent] = useState();
  const [seeEvent, setSeeEvent] = useState(false);
  const [events] = useState([
    {
      title: 'nice event',
      start: new Date(2022, 7, 18, 10, 20, 0),
      end: new Date(2022, 7, 18, 21, 20, 0),
    },
  ]);
  const logout = () => {
    resetAuthData();
    removeCookies('token');
    router.push('/');
  };
  const changeInput = (e, field) => {
    const prevState = fixEvent;
    prevState[field] = e.target.value;
    setfixEvent(prevState);
  };

  return (
    <div className={styles.container}>
      <Header />
      <Notification />
      <button type="button" className={styles.add} onClick={() => { setModal(true); setSeeEvent(false); }}>
        <Image src="/images/add.svg" alt="add" width={24} height={24} />
      </button>
      <button type="button" className={styles.logout} onClick={() => logout()}>
        <Image src="/images/logout.svg" alt="logout" width={24} height={24} />
      </button>
      <div className={styles.main}>
        <FullCalendar
          plugins={[interactionPlugin, dayGridPlugin, timeGridPlugin]}
          initialView="dayGridMonth"
          locale="es"
          dayMaxEventRows
          editable
          eventClick={
            (info) => {
              setEvent(info.event);
              setModal(true);
              setSeeEvent(true);
            }
          }
          events={events}
        />
      </div>
      <ReactModal
        isOpen={modal}
        onRequestClose={() => { setModal(false); setEvent(); setSeeEvent(false); }}
        className={styles.modal}
        onAfterOpen={() => { document.body.style.overflow = 'hidden'; }}
        onAfterClose={() => { document.body.removeAttribute('style'); }}
        ariaHideApp={false}
        style={{ overlay: { backgroundColor: 'rgba(34,34,34, 0.9)', zIndex: '3' } }}
      >
        <button onClick={() => { setModal(false); setEvent(); setSeeEvent(false); }} className={styles.modal__close} type="button">
          &times;
        </button>
        {
          seeEvent ? (
            <div>
              <p>Titulo:</p>
              <p>{event.title}</p>
              <p>Inicio:</p>
              <p>{moment(event.start).tz(moment.tz.guess()).format('LLLL')}</p>
              <p>Fin:</p>
              <p>{moment(event.end).tz(moment.tz.guess()).format('LLLL')}</p>
              <div className={styles.modal__controls}>
                <button className={styles.modal__controls_edit} type="button" onClick={() => setSeeEvent(false)}>
                  <Image src="/images/edit.svg" alt="edit" width={24} height={24} />
                </button>
                <button className={styles.modal__controls_delete} type="button">
                  <Image src="/images/delete.svg" alt="delete" width={24} height={24} />
                </button>
              </div>

            </div>
          ) : (
            <form>
              <p>Datos del evento</p>
              <label htmlFor="title">Titulo</label>
              <input type="text" name="title" id="title" defaultValue={event !== undefined ? event.title : fixEvent.title} />
              <p>Inicio</p>
              <label htmlFor="startDate">Fecha</label>
              <div className={styles.modal__date}>
                <input type="text" name="startYear" id="startYear" defaultValue={event !== undefined ? event.start.getFullYear() : fixEvent.title} onChange={(e) => changeInput(e, 'startYear')} />
                <input type="text" name="startMonth" id="startMonth" defaultValue={event !== undefined ? event.start.getMonth() : fixEvent.title} onChange={(e) => changeInput(e, 'startMonth')} />
                <input type="text" name="startDay" id="startDay" defaultValue={event !== undefined ? event.start.getDay() : fixEvent.title} onChange={(e) => changeInput(e, 'startDay')} />
              </div>
              <label htmlFor="startHours">Hora</label>
              <div className={styles.modal__hours}>
                <input type="text" name="startHours" id="startHours" defaultValue={event !== undefined ? event.start.getHours() : fixEvent.title} onChange={(e) => changeInput(e, 'startHours')} />
                <input type="text" name="startMinutes" id="startMinutes" defaultValue={event !== undefined ? event.start.getMinutes() : fixEvent.title} onChange={(e) => changeInput(e, 'startMinutes')} />
              </div>
              <p>Fin</p>
              <label htmlFor="endDate">Fecha</label>
              <div className={styles.modal__date}>
                <input type="text" name="endYear" id="endYear" defaultValue={event !== undefined ? event.end.getFullYear() : fixEvent.title} onChange={(e) => changeInput(e, 'endYear')} />
                <input type="text" name="endMonth" id="endMonth" defaultValue={event !== undefined ? event.end.getMonth() : fixEvent.title} onChange={(e) => changeInput(e, 'endMonth')} />
                <input type="text" name="endDay" id="endDay" defaultValue={event !== undefined ? event.end.getDay() : fixEvent.title} onChange={(e) => changeInput(e, 'endDay')} />
              </div>
              <label htmlFor="endHours">Hora</label>
              <div className={styles.modal__hours}>
                <input type="text" name="endHours" id="endHours" defaultValue={event !== undefined ? event.end.getHours() : fixEvent.title} onChange={(e) => changeInput(e, 'endHours')} />
                <input type="text" name="endMinutes" id="endMinutes" defaultValue={event !== undefined ? event.end.getMinutes() : fixEvent.title} onChange={(e) => changeInput(e, 'endMinutes')} />
              </div>
              <button className={styles.modal__submit} type="submit">Guardar</button>
            </form>
          )
        }
      </ReactModal>
    </div>
  );
}
