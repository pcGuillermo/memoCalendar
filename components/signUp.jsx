/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../context/authContext';
import { postSignupService } from '../services/loginServices';
import NotificationsContext from '../context/notificationsContext';
import PreLoadContext from '../context/preLoadContext';
import styles from '../styles/Home.module.scss';

export default function SignUp() {
  const router = useRouter();
  const { setAuthData } = useContext(AuthContext);
  const { addNotification, setNotifications } = useContext(NotificationsContext);
  const { setPreLoad } = useContext(PreLoadContext);
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const changeInput = (event, field) => {
    const prevState = user;
    prevState[field] = event.target.value;
    setUser(prevState);
  };
  const createCookie = (name, value) => {
    document.cookie = `${name}=${value}; path=/; SameSite=None; Secure`;
  };
  const validateForm = (e) => {
    e.preventDefault();
    setNotifications([]);
    if (user.email === '' || user.password === '' || user.username === '' || user.passwordConfirmation === '') {
      addNotification('information', '', 'Recuerde que todos los campos son obligatorios.', '7');
    } else if (!(/^(([^<>()[\]/.,;:\s@/"]+(\.[^<>()[\]/.,;:\s@/"]+)*)|('.+'))@(([^<>()[\]/.,;:\s@/"]+\.)+[^<>()[\]/.,;:\s/"]{2,})$/i.test(user.email))) {
      addNotification('warning', '', 'Ingrese un correo válido.', '7');
    } else if (user.password !== user.passwordConfirmation) {
      addNotification('warning', '', 'La contraseña y su confirmacion no coinciden.', '7');
    } else {
      setPreLoad(true);

      postSignupService(user)
        .then((response) => {
          if (response.status === 200 || response.status === 400) {
            return response;
          }
          throw new Error(response);
        })
        .then((response) => response.json())
        .then((result) => {
          if (result.message === 'The user already exists') {
            addNotification('warning', '', 'Usuario ya existe', '5');
            setPreLoad(false);
          } else if (result.message === 'The email already exists') {
            addNotification('warning', '', 'Email ya existe', '5');
            setPreLoad(false);
          } else {
            localStorage.setItem('auth', JSON.stringify(result));
            setAuthData(result);
            createCookie('token', result.token);
            addNotification('confirmation', '', 'Bienvenido!', '5');
            router.push('./calendar');
            setPreLoad(false);
          }
        })
        .catch(() => {
          setNotifications([{ type: 'error', title: '', text: 'Hubo un error al crear sesión.' }]);
          setPreLoad(false);
        });
    }
  };
  return (
    <form className={styles.form} onSubmit={validateForm}>
      <label htmlFor="username">Nombre  de usuario</label>
      <input name="username" id="username" type="text" onChange={(ev) => changeInput(ev, 'username')} defaultValue={user.username} autoComplete="off" />
      <label htmlFor="email">Correo</label>
      <input id="email" type="mail" onChange={(ev) => changeInput(ev, 'email')} defaultValue={user.email} />
      <div className={styles.form__input50}>
        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" onChange={(ev) => changeInput(ev, 'password')} defaultValue={user.password} />
      </div>
      <div className={styles.form__input50}>
        <label htmlFor="passwordConfirmation">Confirmar Contraseña</label>
        <input id="passwordConfirmation" type="password" onChange={(ev) => changeInput(ev, 'passwordConfirmation')} defaultValue={user.passwordConfirmation} />
      </div>
      <div className={styles.form__submit}>
        <button type="submit">Crear Cuenta</button>
      </div>
    </form>

  );
}
