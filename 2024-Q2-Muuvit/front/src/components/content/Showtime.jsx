import React from 'react'
import styles from './css/Showtime.module.css';
import { useLoginData } from '@context/useLoginData';

/**
 * Showtime component for displaying showtimes.
 * @param show_id The id of the show.
 * @param event_id The id of the event.
 * @param area_id The id of the area.
 * @param show_title The title of the show.
 * @param show_start_time The start time of the show.
 * @param show_theatreAndAuditorium The theatre and auditorium of the show.
 * @param onButtonClick The function to call when the button is clicked.
 * @param buttonName The name of the button.
 * @returns {Element}
 */


export default function Showtime({show_id, event_id, area_id, show_title, show_start_time, show_theatreAndAuditorium, onButtonClick, buttonName}) {
  const loginData = useLoginData();

    return (
        <div className={styles.showtime} key={show_id}>
            <div className={styles.upper}>
                <h4 className={styles.title}>{show_title}</h4>
                {loginData.token && buttonName && onButtonClick && (
                    <button onClick={onButtonClick}>{buttonName}</button>
                )}
            </div>
            <p className={styles.info}>Alkaa: {show_start_time}</p>
            <p className={styles.info}>Teatteri ja sali: {show_theatreAndAuditorium}</p>
        </div>
    );
}
