import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/Showtimes.module.css';
import { useLoginData} from '@context/useLoginData'
import PostEventToGroup from './PostEventToGroup';
import Showtime from './Showtime';

/**
 * Showtimes component for displaying showtimes.
 * @param selectedArea The selected area. This is used to fetch showtimes from the selected area.
 * @param selectedDate The selected date. This is used to fetch showtimes from the selected date.
 * @returns {Element}
 */


export default function Showtimes({selectedArea,selectedDate}) {
    const [showtimes, setShowtimes] = useState([]);
    const [loading, setLoading] = useState(true);
    const loginData = useLoginData();
    const [eventInfo, setEventInfo] = useState({event_id:'', show_id:'', areaID: '', event_title:''});
    const [showPostEvent, setShowPostEvent] = useState(false);

    const postEvent = (eventID, showID, areaID, title) => {
        console.log('Lisätään ryhmään');
        setShowPostEvent(true);
        setEventInfo({event_id: eventID, show_id: showID, areaID: areaID, event_title: title});
    } 

    const fetchData = async () => {
        if (!selectedArea || !selectedDate) {
            console.log('Valitse alue ja päivämäärä');
            return;
        }
    
        setShowtimes([]);

        const formattedDate = new Date(selectedDate);
        const day = formattedDate.getDate() < 10 ? `0${formattedDate.getDate()}` : formattedDate.getDate();
        const month = (formattedDate.getMonth() + 1) < 10 ? `0${formattedDate.getMonth() + 1}` : formattedDate.getMonth() + 1;
        const formattedDateString = `${day}.${month}.${formattedDate.getFullYear()}`;
        
        console.log('Muotoiltu päivämäärä:', formattedDateString);
    
        try {
            const showsResponse = await axios.get(`https://www.finnkino.fi/xml/Schedule/?area=${selectedArea}&dt=${formattedDateString}`)
            const showsData = showsResponse.data; // Use .data property to access the response data
            const showsParser = new DOMParser();
            const showsXmlDoc = showsParser.parseFromString(showsData, 'text/xml');
            const shows = Array.from(showsXmlDoc.getElementsByTagName('Show')).map(show => {
                console.log(show);
                const id = show.querySelector('ID')?.textContent || '';
                const eventId = show.querySelector('EventID')?.textContent || '';
                const title = show.querySelector('Title')?.textContent || '';
                const start_time = show.querySelector('dttmShowStart')?.textContent || '';
                const theatreAndAuditorium = show.querySelector('TheatreAndAuditorium')?.textContent || '';
                return { id, eventId, title, start_time, theatreAndAuditorium };
            });
            setShowtimes(shows);
            setLoading(false); // Set loading state to false after data is fetched
        } catch (error) {
            console.error('Virhe haettaessa näytösaikoja:', error);
        }
        
    }

    useEffect(() => {fetchData()}, [selectedArea, selectedDate]);

    const formattedShowtimes = showtimes.map(show => {
            const startDateTime = new Date(show.start_time);
            
            const day = startDateTime.getDate() < 10 ? `0${startDateTime.getDate()}` : startDateTime.getDate();
            const month = (startDateTime.getMonth() + 1) < 10 ? `0${startDateTime.getMonth() + 1}` : startDateTime.getMonth() + 1;
            const year = startDateTime.getFullYear();
            const hours = startDateTime.getHours() < 10 ? `0${startDateTime.getHours()}` : startDateTime.getHours();
            const minutes = startDateTime.getMinutes() < 10 ? `0${startDateTime.getMinutes()}` : startDateTime.getMinutes();
            
            const formattedStartTime = `${day}.${month}.${year} klo ${hours}:${minutes}`;

            return {
                    ...show,
                    start_time: formattedStartTime,
            };
    });

    return (
        <div className={styles.showtimes}>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    {showPostEvent && <PostEventToGroup eventId={eventInfo.event_id} showId={eventInfo.show_id} areaID={eventInfo.areaID} eventTitle={eventInfo.event_title} setShowPostEvent={setShowPostEvent} />}
                    {formattedShowtimes.map(show => (
                        <Showtime show_id={show.id} event_id={show.eventId} area_id={selectedArea} show_title={show.title} show_start_time={show.start_time} show_theatreAndAuditorium={show.theatreAndAuditorium} onButtonClick={() => postEvent(show.eventId, show.id, selectedArea, show.title)} buttonName={'Lisää'}/>
                    ))}
                </>
            )}
        </div>
    );
}
