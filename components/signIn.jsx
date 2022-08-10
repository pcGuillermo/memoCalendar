/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import NotificationsContext from '../context/notificationsContext';
import PreLoadContext from '../context/preLoadContext';
import styles from '../styles/Home.module.scss';

export default function SignIn() {
  const router = useRouter();
  const { addNotification, setNotifications } = useContext(NotificationsContext);
  const { setPreLoad } = useContext(PreLoadContext);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  /*   const createCookie = (name, value) => {
    document.cookie = `${name}=${value}; path=/; SameSite=None; Secure`;
  }; */
  const changeInput = (event, field) => {
    const prevState = user;
    prevState[field] = event.target.value;
    setUser(prevState);
  };

  const validateForm = (e) => {
    e.preventDefault();
    setNotifications([]);
    if (user.email === '' || user.password === '') {
      addNotification('information', '', 'Recuerde que todos los campos son obligatorios.', '7');
    } else if (!(/^(([^<>()[\]/.,;:\s@/"]+(\.[^<>()[\]/.,;:\s@/"]+)*)|('.+'))@(([^<>()[\]/.,;:\s@/"]+\.)+[^<>()[\]/.,;:\s/"]{2,})$/i.test(user.email))) {
      addNotification('warning', '', 'Ingrese un correo válido.', '7');
    } else {
      setPreLoad(true);
      addNotification('confirmation', '', 'Bienvenido!', '5');
      router.push('./calendar');
      setPreLoad(false);
    }
  };
  return (
    <form className={styles.form} onSubmit={validateForm}>
      <label htmlFor="email">Correo</label>
      <input id="email" type="mail" onChange={(ev) => changeInput(ev, 'email')} defaultValue={user.email} />
      <label htmlFor="password">Contraseña</label>
      <input id="password" type="password" onChange={(ev) => changeInput(ev, 'password')} defaultValue={user.password} />
      <div className={styles.form__submit}>
        <button type="submit">Iniciar Secion</button>
      </div>
    </form>

  );
}
