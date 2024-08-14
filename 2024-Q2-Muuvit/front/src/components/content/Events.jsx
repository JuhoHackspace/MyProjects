import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '@components/content/css/Events.module.css';

/**
 * This component fetches and displays events from Finnkino API.
 * @param selectedArea // The selected area from the parent component. This is used to fetch events from the selected area.
 * @returns {Element}
 */


const Events = ({ selectedArea }) => {
  const [eventsData, setEventsData] = useState([]);

  const fetchData = async () => {
    if (!selectedArea) {
      console.error('Valitse alue ennen hakua.');
      return;
    }

    try {
      const response = await axios.get(`https://www.finnkino.fi/xml/Events/?listType=NowInTheatres&area=${selectedArea}`);
      const data = response.data;
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(data, 'text/xml');
      const events = Array.from(xmlDoc.getElementsByTagName('Event')).map(event => {
        const id = event.querySelector('ID')?.textContent || '';
        const title = event.querySelector('Title')?.textContent || '';
        const synopsis = event.querySelector('ShortSynopsis')?.textContent || '';
        const genres = event.querySelector('Genres')?.textContent || '';
        const imageUrl = event.querySelector('EventMediumImagePortrait')?.textContent || '';
        const trailerUrl = event.querySelector('Videos EventVideo Location')?.textContent || '';

        return { id, title, synopsis, genres, imageUrl, trailerUrl };
      });
      setEventsData(events);
    } catch (error) {
      console.error('Virhe haettaessa tapahtumia:', error);
    }
  };
  
  useEffect(() => {fetchData()}, [selectedArea]);

  return (
    <div className={styles.event}>
      {eventsData.map(event => (
        <div className={styles.container} key={event.id}>
          <section className={styles.section}>
            <h4 className={styles.title}>{event.title}</h4>
            <p className={styles.info}>{event.synopsis}</p>
            <p className={styles.info}>Genre: {event.genres}</p>
          </section>
          {event.imageUrl && <img className={styles.img} src={event.imageUrl} alt={event.title} />}
        </div>
      ))}
    </div>
  );
};

export default Events;