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
import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import AuthContext from '../context/authContext';
import { removeCookies } from './_app';
import Header from '../components/header';
import Notification from '../components/notifications';
import NotificationsContext from '../context/notificationsContext';
import PreLoadContext from '../context/preLoadContext';
import {
  postEventService, getEventService, deleteEventService, putEventService,
} from '../services/eventServices';
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
  const [title, setTitle] = useState('');
  const [dateStart, setDateStart] = useState();
  const [dateEnd, setDateEnd] = useState();
  const [event, setEvent] = useState();
  const [seeEvent, setSeeEvent] = useState(false);
  const [events, setEvents] = useState([]);

  // get events-------------------------------------------------------------------------------------
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

  // reset values----------------------------------------------------------------------------------
  const reset = () => {
    setModal(false);
    setDateEnd(null);
    setDateStart(null);
    setTitle('');
    getEvents();
    setEvent();
    setSeeEvent(false);
  };

  // delete events----------------------------------------------------------------------------------
  const deleteEvents = () => {
    // eslint-disable-next-line no-underscore-dangle
    deleteEventService(event._def.extendedProps._id, authData.token)
      .then((response) => {
        if (response.status === 204) {
          return response;
        }
        throw new Error(response);
      })
      .then(() => {
        getEvents();
        addNotification('confirmation', '', 'Evento eliminado', '5');
        reset();
      })
      .catch(() => {
        setNotifications([{ type: 'error', title: '', text: 'Hubo un error al eliminar el evento.' }]);
        setPreLoad(false);
      });
  };

  // logout-------------------------------------------------------------------------------------
  const logout = () => {
    resetAuthData();
    removeCookies('token');
    router.push('/');
  };
  // update events----------------------------------------------------------------------------------
  const updateEvent = (e) => {
    e.preventDefault();
    const dateEvent = {
      title,
      user: authData.user.id,
      backgroundColor: 'white',
      start: dateStart,
      end: dateEnd,
    };
    setPreLoad(true);
    // eslint-disable-next-line no-underscore-dangle
    putEventService(dateEvent, event._def.extendedProps._id, authData.token)
      .then((response) => {
        if (response.status === 200) {
          return response;
        }
        throw new Error(response);
      })
      .then((response) => response.json())
      .then(() => {
        addNotification('confirmation', '', 'Evento creado', '5');
        setPreLoad(false);
        reset();
      })
      .catch(() => {
        setNotifications([{ type: 'error', title: '', text: 'Hubo un error al crear el evento.' }]);
        setPreLoad(false);
      });
  };
  // create events----------------------------------------------------------------------------------
  const createEvent = (e) => {
    e.preventDefault();
    const dateEvent = {
      title,
      user: authData.user.id,
      backgroundColor: 'white',
      start: dateStart,
      end: dateEnd,
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
        reset();
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
      <button type="button" className={styles.add} onClick={() => { setModal(true); }}>
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
              setDateEnd(info.event.end);
              setDateStart(info.event.start);
              setTitle(info.event.title);
            }
          }
          events={events}
        />
      </div>
      <ReactModal
        isOpen={modal}
        onRequestClose={() => reset()}
        className={styles.modal}
        onAfterOpen={() => { document.body.style.overflow = 'hidden'; }}
        onAfterClose={() => { document.body.removeAttribute('style'); }}
        ariaHideApp={false}
        style={{ overlay: { backgroundColor: 'rgba(34,34,34, 0.9)', zIndex: '3' } }}
      >
        <button onClick={() => reset()} className={styles.modal__close} type="button">
          &times;
        </button>
        {
          seeEvent ? (
            <div>
              <p>{`Titulo: ${event.title}`}</p>
              <p>{`Inicio: ${moment(event.start).tz(moment.tz.guess()).format('LLLL')}`}</p>
              <p>{`Fin: ${moment(event.end).tz(moment.tz.guess()).format('LLLL')}`}</p>
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
            <form onSubmit={event !== undefined ? updateEvent : createEvent}>
              <p>Datos del evento</p>
              <label htmlFor="title">Titulo</label>
              <input type="text" name="title" id="title" defaultValue={title} onChange={(e) => setTitle(e.target.value)} />
              <div className={styles.modal__dates}>
                <div className={styles.modal__dates_date}>
                  <label htmlFor="startDate">Inicio</label>
                  <DateTimePicker onChange={setDateStart} value={dateStart} />
                </div>
                <div className={styles.modal__dates_date}>
                  <label htmlFor="endDate">Fin</label>
                  <DateTimePicker onChange={setDateEnd} value={dateEnd} />
                </div>
              </div>
              <button className={styles.modal__submit} type="submit">Guardar</button>
            </form>
          )
        }
      </ReactModal>
    </div>
  );
}
