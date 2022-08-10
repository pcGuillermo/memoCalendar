/* eslint-disable linebreak-style */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import styles from '../styles/Home.module.scss';

export default function SignUp() {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const years = [];
  const year = new Date().getFullYear();
  for (let i = year - 18, j = 0; i > year - 80; i -= 1, j += 1) { years[j] = i; }
  const days = [];
  for (let i = 1; i < 32; i += 1) { days[i] = i; }
  const [user, setUser] = useState({
    name: '',
    lastName: '',
    middleName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    birthDay: '',
    birthMonth: '',
    birthYear: '',
  });
  const changeInput = (event, field) => {
    const prevState = user;
    prevState[field] = event.target.value;
    setUser(prevState);
  };

  const validateForm = (e) => {
    e.preventDefault();
  };
  return (
    <form className={styles.form} onSubmit={validateForm}>
      <label htmlFor="name">Primer nombre </label>
      <input name="name" id="name" type="text" onChange={(ev) => changeInput(ev, 'name')} defaultValue={user.name} autoComplete="off" />
      <div className={styles.form__input50}>
        <label htmlFor="lastName">Apellido Paterno</label>
        <input id="lastName" type="text" onChange={(ev) => changeInput(ev, 'lastName')} defaultValue={user.lastName} />
      </div>
      <div className={styles.form__input50}>
        <label htmlFor="middleLastName">Apellido Materno</label>
        <input id="middleLastName" type="text" onChange={(ev) => changeInput(ev, 'middleName')} defaultValue={user.middleName} />
      </div>
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

      <div className={styles.form__date_day}>
        <label htmlFor="day">Día</label>
        <select id="day" type="number" list="day" onChange={(ev) => changeInput(ev, 'birthDay')} defaultValue={user.birthDay}>
          <option value="" disabled> </option>
          {
            days.map((day, index) => {
              const keyIndex = index + 1;
              return (<option key={keyIndex} value={(`0${day}`).slice(-2)}>{day}</option>);
            })
          }
        </select>
      </div>
      <div className={styles.form__date_month}>
        <label htmlFor="month">Mes</label>
        <select id="month" list="month" onChange={(ev) => changeInput(ev, 'birthMonth')} defaultValue={user.birthMonth}>
          <option value="" disabled> </option>
          {
            months.map((month, index) => {
              const keyIndex = index + 1;
              return (<option key={keyIndex} value={(`0${keyIndex}`).slice(-2)}>{month}</option>);
            })
          }
        </select>
      </div>
      <div className={styles.form__date_year}>
        <label htmlFor="year">Año</label>
        <select id="year" list="year" onChange={(ev) => changeInput(ev, 'birthYear')} defaultValue={user.birthYear}>
          <option value="" disabled> </option>
          {
            years.map((y, index) => {
              const keyIndex = index + 1;
              return (<option key={keyIndex} value={`${y}`}>{y}</option>);
            })
          }
        </select>
      </div>
      <div className={styles.form__submit}>
        <button type="submit">Crear Cuenta</button>
      </div>
    </form>

  );
}
