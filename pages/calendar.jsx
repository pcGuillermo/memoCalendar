/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext, useEffect } from 'react';
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
import NotificationsContext from '../context/notificationsContext';
import PreLoadContext from '../context/preLoadContext';
import { postEventService, getEventService, deleteEventService } from '../services/eventServices';
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
  const { resetAuthData, authData } = useContext(AuthContext);
  const { addNotification, setNotifications } = useContext(NotificationsContext);
  const { setPreLoad } = useContext(PreLoadContext);
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
  const [events, setEvents] = useState([]);
  const getEvents = () => {
    getEventService(authData.user.id, authData.token)
      .then((response) => response.json())
      .then((result) => {
        setEvents(result);
      })
      .catch(() => {
        setNotifications([{ type: 'error', title: '', text: 'Hubo un error.' }]);
        setPreLoad(false);
      });
  };
  useEffect(() => {
    getEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const deleteEvents = () => {
    // eslint-disable-next-line no-underscore-dangle
    deleteEventService(event._def.extendedProps._id, authData.token)
      .then((response) => response.json())
      .then(() => {
        getEvents();
        addNotification('confirmation', '', 'Evento eliminado', '5');
      });
  };
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
  const editEvent = (e) => {
    e.preventDefault();
  };
  const createEvent = (e) => {
    e.preventDefault();
    const dateEvent = {
      title: fixEvent.title,
      user: authData.user.id,
      backgroundColor: 'blue',
      start: new Date(
        fixEvent.startYear,
        fixEvent.startMonth,
        fixEvent.startDay,
        fixEvent.startHours,
        fixEvent.startMinutes,
        0,
      ),
      end: new Date(
        fixEvent.endYear,
        fixEvent.endMonth,
        fixEvent.endDay,
        fixEvent.endHours,
        fixEvent.endMinutes,
        0,
      ),
    };
    setPreLoad(true);
    postEventService(dateEvent, authData.token)
      .then((response) => {
        if (response.status === 201) {
          return response;
        }
        throw new Error(response);
      })
      .then((response) => response.json())
      .then(() => {
        addNotification('confirmation', '', 'Evento creado', '5');
        setPreLoad(false);
        setModal(false);
        getEvents();
      })
      .catch(() => {
        setNotifications([{ type: 'error', title: '', text: 'Hubo un error al crear el evento.' }]);
        setPreLoad(false);
      });
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
                <button className={styles.modal__controls_delete} type="button" onClick={() => deleteEvents()}>
                  <Image src="/images/delete.svg" alt="delete" width={24} height={24} />
                </button>
              </div>

            </div>
          ) : (
            <form onSubmit={event !== undefined ? editEvent : createEvent}>
              <p>Datos del evento</p>
              <label htmlFor="title">Titulo</label>
              <input type="text" name="title" id="title" defaultValue={event !== undefined ? event.title : fixEvent.title} onChange={(e) => changeInput(e, 'title')} />
              <p>Inicio</p>
              <label htmlFor="startDate">Fecha</label>
              <div className={styles.modal__date}>
                <input type="text" name="startYear" id="startYear" defaultValue={event !== undefined ? event.start.getFullYear() : fixEvent.startYear} onChange={(e) => changeInput(e, 'startYear')} />
                <input type="text" name="startMonth" id="startMonth" defaultValue={event !== undefined ? event.start.getMonth() : fixEvent.startMonth} onChange={(e) => changeInput(e, 'startMonth')} />
                <input type="text" name="startDay" id="startDay" defaultValue={event !== undefined ? event.start.getDay() : fixEvent.startDay} onChange={(e) => changeInput(e, 'startDay')} />
              </div>
              <label htmlFor="startHours">Hora</label>
              <div className={styles.modal__hours}>
                <input type="text" name="startHours" id="startHours" defaultValue={event !== undefined ? event.start.getHours() : fixEvent.startHours} onChange={(e) => changeInput(e, 'startHours')} />
                <input type="text" name="startMinutes" id="startMinutes" defaultValue={event !== undefined ? event.start.getMinutes() : fixEvent.startMinutes} onChange={(e) => changeInput(e, 'startMinutes')} />
              </div>
              <p>Fin</p>
              <label htmlFor="endDate">Fecha</label>
              <div className={styles.modal__date}>
                <input type="text" name="endYear" id="endYear" defaultValue={event !== undefined ? event.end.getFullYear() : fixEvent.endYear} onChange={(e) => changeInput(e, 'endYear')} />
                <input type="text" name="endMonth" id="endMonth" defaultValue={event !== undefined ? event.end.getMonth() : fixEvent.endMonth} onChange={(e) => changeInput(e, 'endMonth')} />
                <input type="text" name="endDay" id="endDay" defaultValue={event !== undefined ? event.end.getDay() : fixEvent.endDay} onChange={(e) => changeInput(e, 'endDay')} />
              </div>
              <label htmlFor="endHours">Hora</label>
              <div className={styles.modal__hours}>
                <input type="text" name="endHours" id="endHours" defaultValue={event !== undefined ? event.end.getHours() : fixEvent.endHours} onChange={(e) => changeInput(e, 'endHours')} />
                <input type="text" name="endMinutes" id="endMinutes" defaultValue={event !== undefined ? event.end.getMinutes() : fixEvent.endMinutes} onChange={(e) => changeInput(e, 'endMinutes')} />
              </div>
              <button className={styles.modal__submit} type="submit">Guardar</button>
            </form>
          )
        }
      </ReactModal>
    </div>
  );
}
