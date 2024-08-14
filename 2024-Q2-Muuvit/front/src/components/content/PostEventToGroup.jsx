import React from 'react'
import {useState, useEffect} from 'react'
import { useLoginData } from '../../context/useLoginData';
import styles from './css/PostEventToGroup.module.css';
import axios from 'axios';
import { set } from 'date-fns';

/**
 * PostEventToGroup component for posting an event to a group.
 * @param eventId The id of the event.
 * @param showId The id of the show.
 * @param areaID The id of the area.
 * @param eventTitle The title of the event.
 * @param setShowPostEvent The function to set the post event form. This is used to close the form.
 * @returns {Element}
 */


export default function PostEventToGroup({ eventId, showId, areaID, eventTitle, setShowPostEvent}) {
    const [myGroups, setMyGroups] = useState({ groups: [], found: false });
    const [group, setGroup] = useState('');
    const loginData = useLoginData();
    const [postEventStatus, setPostEventStatus] = useState('');
    const [eventPosted, setEventPosted] = useState(false);

    const selectGroup = (e) => {
        console.log('Valittu ryhmä:', e.target.value);
        setGroup(e.target.value);
    }
    
    const closeForm = () => {
        setShowPostEvent(false);
        setPostEventStatus('');
        setGroup('');
    }

    useEffect( () => {
        setTimeout(() => {
            setPostEventStatus('');
            setEventPosted(false);
        }, 3000)
    },[eventPosted])

    const postEvent = async () => {
        if (group==='') {
            console.log('Valitse ryhmä');
            return;
        }
        const body = {"group_id": group, "event_id": eventId, "show_id": showId, "area_id":areaID};
        console.log('Lähetettävä data:', body);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/event/private/addToGroup`, body, {
                withCredentials: true,
                headers: { Authorization: `bearer ${loginData.token}`,
                            'Content-Type': 'application/json'}
            });
            if (response.status === 200) {
                console.log('Tapahtuma lisätty ryhmään');
                setPostEventStatus('Tapahtuma lisätty ryhmään');
                setEventPosted(true);
            }
        } catch (error) {
            console.log(error);
            if(error.response.status === 400 && error.response.data === 'Event already exists') {
                setPostEventStatus('Tapahtuma on jo lisätty ryhmään');
            } else {
                console.error('Virhe lisättäessä tapahtumaa ryhmään:', error);
                setPostEventStatus('Virhe lisättäessä tapahtumaa ryhmään');
            }
        }
    }

    const fetchGroups = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/private/allmygroups`, {
                withCredentials: true,
                headers: { Authorization: `bearer ${loginData.token}` }
            });
            if (response.status === 200 && response.data.length > 0) {
                setMyGroups({groups: response.data, found: true});
                setGroup(response.data[0].groupId);
            }
        } catch (error) {
            console.error('Virhe haettaessa ryhmiä:', error);
        }
    }

    useEffect(() => { fetchGroups() }, []);

    return (
        <div className={styles.selectGroup}>
            <h3 className={styles.header}>Lisää tapahtuma {eventTitle} ryhmään</h3>
            <div className={styles.upper}>
                <label className={styles.label} htmlFor='group'>Valitse ryhmä:</label>
                <select className={styles.select} onChange={selectGroup} value={group}>
                    {!myGroups.found ? <option value=''>Ei ryhmiä</option>:
                    myGroups.groups.map(group => (
                        <option key={group.groupId} value={group.groupId}>{group.groupName}</option>
                    ))}
                </select>
            </div>
            <div className={styles.lower}>
                <p className={styles.status}>{postEventStatus}</p>
                <div className={styles.buttons}>
                    <button onClick={postEvent}>Lisää</button>
                    <button onClick={closeForm}>Paluu</button>
                </div>
            </div>
        </div>
    )
}
