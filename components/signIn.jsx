/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import AuthContext from '../context/authContext';
import NotificationsContext from '../context/notificationsContext';
import PreLoadContext from '../context/preLoadContext';
import { postSigninService } from '../services/loginServices';
import styles from '../styles/Home.module.scss';

export default function SignIn() {
  const router = useRouter();
  const { setAuthData } = useContext(AuthContext);
  const { addNotification, setNotifications } = useContext(NotificationsContext);
  const { setPreLoad } = useContext(PreLoadContext);
  const [user, setUser] = useState({
    email: '',
    password: '',
  });
  const createCookie = (name, value) => {
    document.cookie = `${name}=${value}; path=/; SameSite=None; Secure`;
  };
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

      postSigninService(user)
        .then((response) => {
          if (response.status === 200 || response.status === 400 || response.status === 401) {
            return response;
          }
          throw new Error(response);
        })
        .then((response) => response.json())
        .then((result) => {
          if (result.message === 'User no found') {
            addNotification('warning', '', 'Usuario no encontrado', '5');
            setPreLoad(false);
          } else if (result.message === 'Invalid password') {
            addNotification('warning', '', 'Contraseña invalida', '5');
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
          setNotifications([{ type: 'error', title: '', text: 'Hubo un error al iniciar sesión.' }]);
          setPreLoad(false);
        });
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
