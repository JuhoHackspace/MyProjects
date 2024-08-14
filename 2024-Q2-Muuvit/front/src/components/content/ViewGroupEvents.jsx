import React, { useState, useEffect } from 'react'; // Add missing import statement
import { useLoginData} from '@context/useLoginData'
import styles from './css/ViewGroupEvents.module.css'
import PaginatorNavigateMenu from './Movies/PaginatorNavigateMenu'
import axios from 'axios'
import Showtime from './Showtime'
import { set } from 'date-fns';

/**
 * ViewGroupEvents component for viewing showtimes posted to the group.
 * @param group_id The id of the group.
 * @param isOwner The boolean value to check if the user is the owner of the group.
 * @returns {Element}
 */


export default function ViewGroupEvents({group_id, isOwner}) {
    const loginData = useLoginData()
    const [shows, setShows] = useState([])
    const [finalShows, setFinalShows] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [statusMessage, setStatusMessage] = useState('Ei tapahtumia')

    const getEvents = async () => {
        setShows([])
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/event/private/getGroupEvents/${group_id}/${page}`, {
                withCredentials: true,
                headers: { Authorization: `bearer ${loginData.token}` }
            })
            if (response.status === 200) {
                if(response.data.events.length > 0) {
                    console.log('Tapahtumat:', response.data.events)
                    setShows(response.data.events)
                    setTotalPages(response.data.numPages)
                    setStatusMessage('Tapahtumat')
                } else {
                    setStatusMessage('Ei tapahtumia')
                }
            }
        } catch (error) {
            console.error('Virhe haettaessa tapahtumia:', error)
            setStatusMessage('Virhe haettaessa tapahtumia')
        }
    }
    
    const retrieveShowsFromFinnkino = async () => {
        setFinalShows([])
        try {
            const finalShowsArray = [];
            for (const show of shows) {
                try {
                    const showsResponse = await axios.get(`https://www.finnkino.fi/xml/Schedule/?area=${show.areaIdOnFinnkino}&eventID=${show.eventIdOnFinnkino}`);
                    const showsData = showsResponse.data;
                    const showsParser = new DOMParser();
                    const showsXmlDoc = showsParser.parseFromString(showsData, 'text/xml');
                    const showElements = Array.from(showsXmlDoc.getElementsByTagName('Show'));
                    const filteredShowElement = showElements.find(showElement => {
                        const id = showElement.querySelector('ID')?.textContent || '';
                        console.log('ID:', id, 'showIdOnFinnkino:', show.showIdOnFinnkino);
                        return id == show.showIdOnFinnkino;
                    });
                    if (filteredShowElement) {
                        const id = filteredShowElement.querySelector('ID')?.textContent || '';
                        const eventId = show.eventIdOnFinnkino;
                        const title = filteredShowElement.querySelector('Title')?.textContent || '';
                        const start_time = filteredShowElement.querySelector('dttmShowStart')?.textContent || '';
                        const theatreAndAuditorium = filteredShowElement.querySelector('TheatreAndAuditorium')?.textContent || '';
                        finalShowsArray.push({ id, eventId, title, start_time, theatreAndAuditorium });
                    }
                } catch (error) {
                    console.error('Virhe haettaessa näytösaikoja:', error);
                }
            }
            setFinalShows(finalShowsArray);
            console.log('Final shows:', finalShowsArray);
        } catch (error) {
            console.error('Virhe haettaessa näytösaikoja:', error);
        }
    };
    const deleteEvent = async (show_id, event_id) => {
        console.log('Poistetaan tapahtuma:', show_id);
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/event/private/deleteEvent/${group_id}/${event_id}/${show_id}`, {
                withCredentials: true,
                headers: { Authorization: `bearer ${loginData.token}` }
            });
            if (response.status === 200) {
                console.log('Tapahtuma poistettu');
                getEvents();
            }
        } catch (error) {
            console.error('Virhe poistettaessa tapahtumaa:', error);
        }
    }
    useEffect(() => {
        getEvents()
    }, [page])

    useEffect(() => {
        retrieveShowsFromFinnkino()
    }, [shows])

    return (
        <div className={styles.groupEvents}>
            {finalShows.length > 0 &&  <PaginatorNavigateMenu currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
            {finalShows.length === 0 && <h2>Ei näytöksiä</h2>}
            <div className={styles.container}>
                {finalShows.map(show => (
                    <Showtime 
                        show_id={show.id} 
                        event_id={show.eventId} 
                        show_title={show.title} 
                        show_start_time={show.start_time} 
                        show_theatreAndAuditorium={show.theatreAndAuditorium} 
                        buttonName={isOwner ? 'Poista' : undefined}
                        onButtonClick={isOwner ? () => deleteEvent(show.id, show.eventId) : undefined}
                    />
                ))}
            </div>
        </div>
    )
}
