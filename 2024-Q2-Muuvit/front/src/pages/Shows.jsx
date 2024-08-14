import React, { useState } from 'react';
import Area from '@content/Area.jsx';
import Dates from '@content/Dates.jsx';
import Events from '@content/Events.jsx';
import Showtimes from '@content/Showtimes';
import styles from './css/Shows.module.css';
import { set } from 'date-fns';
import { id } from 'date-fns/locale';

/**
 * Shows component for searching showtimes and events from Finnkino.
 * @returns {Element}
 */


const Shows = () => {
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [showShowtimes, setShowShowtimes] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const handleDateSelection = (date) => {
    setSelectedDate(date);
    setShowShowtimes(false);
    setShowEvents(false);
  };
  
  const haeNaytosajat = () => {
    setShowShowtimes(true);
    setShowEvents(false);
  }

  const haeTapahtumat = () => {
    setShowEvents(true);
    setShowShowtimes(false);
  }
  // manuaalinen haun tyhjennys
  const tyhjennaHaku = () => {
    setShowShowtimes(false);
    setShowEvents(false);
    console.log('Lista tyhjennetty manuaalisesti');
  };
          
  return (
    <div className={styles.shows}>

      <p className={styles.header}>Finnkinon näytösajat ja tapahtumat haettavissa teattereittain ympäri Suomea.</p>

      <div className={styles.search_form}>
        <Area setSelectedArea={setSelectedArea} /> <br/>
        <Dates onSelectDate={handleDateSelection} /> <br/>
        <label htmlFor="date"> Valitse metodi:</label>
        <div className={styles.button_container}>
          <button className={styles.button} onClick={haeNaytosajat}>Hae näytösajat</button>
          <button className={styles.button} onClick={haeTapahtumat}>Teattereissa nyt</button>
          <button className={styles.button} onClick={tyhjennaHaku}>Tyhjennä lista</button>
        </div>
      </div>     
      <div className={styles.search_results}>
        {showEvents && !selectedArea && <p>Valitse ensin alue</p>}
        {showShowtimes && (!selectedArea || !selectedDate) && <p>Valitse ensin alue ja päivämäärä</p>}
        {showEvents && selectedArea && <Events selectedArea={selectedArea} />}
        {showShowtimes && selectedArea && selectedDate && <Showtimes selectedArea={selectedArea} selectedDate={selectedDate} />}     
      </div>

    </div>

  );
};

export default Shows;
