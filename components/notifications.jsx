/* eslint-disable no-nested-ternary */
import React, { useContext, useEffect } from 'react';
import Image from 'next/image';
import NotificationsContext from '../context/notificationsContext';
import styles from '../styles/Home.module.scss';

export default function Notification() {
  const { notifications, setNotifications } = useContext(NotificationsContext);
  const removeNotification = (keyIndex) => {
    const removeNotifications = [
      ...notifications.slice(0, keyIndex - 1),
      ...notifications.slice(keyIndex, notifications.length)];
    setNotifications(removeNotifications);
  };
  const removeTemporaryNotification = () => {
    for (let i = 0; i < notifications.length; i += 1) {
      const auxExpires = parseFloat(notifications[i].expires);
      if (typeof auxExpires === 'number') {
        if (Math.floor((new Date().getTime() / 1000.0)) >= auxExpires) {
          const removeNotifications = [
            ...notifications.slice(0, i),
            ...notifications.slice(i + 1, notifications.length)];
          setNotifications(removeNotifications);
        }
      }
    }
  };
  useEffect(() => { // remove temporary notification, (interval)
    if (notifications.length > 0) {
      const removeNotificationInterval = setInterval(() => removeTemporaryNotification(), 1000);
      return () => clearInterval(removeNotificationInterval);
    }
    return undefined;
  });
  return (
    <div className={styles.notifications}>
      {notifications.map((notification, index) => {
        const keyIndex = index + 1;
        const background = notification.type === 'warning' ? styles.notifications__warning
          : notification.type === 'information' ? styles.notifications__information
            : notification.type === 'confirmation' ? styles.notifications__confirmation
              : notification.type === 'error' ? styles.notifications__error
                : (null);
        return (
          <div key={keyIndex} className={background}>
            <div className={styles.notifications__notification}>
              <Image alt="Alerta" src={`/images/${notification.type}.svg`} width={22} height={25} />
              <div className={styles.notifications__notification_body}>
                {notification.title !== '' && (<p className={styles.notifications__notification_strong}>{notification.title}</p>)}
                <p>{notification.text}</p>
              </div>
            </div>
            <button type="button" onClick={() => removeNotification(keyIndex)}>&times;</button>
          </div>
        );
      })}
    </div>
  );
}
