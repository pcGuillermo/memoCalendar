/* eslint-disable linebreak-style */
import React, { useContext } from 'react';
import ReactModal from 'react-modal';
import PreLoadContext from '../context/preLoadContext';
import styles from '../styles/Home.module.scss';

export default function PreLoad() {
  const { preLoad } = useContext(PreLoadContext);
  return (
    <ReactModal
      isOpen={preLoad}
      onAfterOpen={() => { document.body.style.overflow = 'hidden'; }}
      onAfterClose={() => { document.body.removeAttribute('style'); }}
      className={styles.preload}
      ariaHideApp={false}
      style={{ overlay: { backgroundColor: 'rgba(34,34,34, 0.2)', zIndex: '4' } }}
    >
      <div className={styles.spinner}>
        <div className={styles.circles}>
          <div className={styles.circles__primary} />
          <div className={styles.circles__secondary} />
        </div>
      </div>
    </ReactModal>
  );
}
