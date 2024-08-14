import React from 'react'

import {useState, useEffect} from 'react'
import { useLoginData } from '../../context/useLoginData';
import styles from './css/PostEventToGroup.module.css';
import axios from 'axios';
import { set } from 'date-fns';


/**
 * PostEventToGroup komponentti
 * @param title Title of the movie or tv show.
 * @param id Id of the movie or tv show.
 * @param type Either 'movie' or 'tv'
 * @param setVisible Setter function for visibility of the component.
 * @returns {Element}
 * @constructor
 */
const PostMovieOrTvShowToGroup = ({ title, id, type, setVisible }) => {
    const [myGroups, setMyGroups] = useState({ groups: [], found: false });
    const [group, setGroup] = useState('');
    const loginData = useLoginData();
    const [postMovieStatus, setPostMovieStatus] = useState('');
    const [movieOrTvPosted, setMovieOrTvPosted] = useState(false);

    const selectGroup = (e) => {
        console.log('Valittu ryhmä:', e.target.value);
        setGroup(e.target.value);
    }

    const closeForm = () => {
        setVisible(false);
        setPostMovieStatus('');
        setGroup('');
    }

    useEffect( () => {
        setTimeout(() => {
            setPostMovieStatus('');
            setMovieOrTvPosted(false);
        }, 3500)
    },[movieOrTvPosted])

    const postEvent = async () => {
        if (group==='') {
            console.log('Valitse ryhmä');
            return;
        }
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/movie/private/group/addToGroup/${type}/${id}/${group}`, {
                withCredentials: true,
                headers: { Authorization: `bearer ${loginData.token}`,
                    'Content-Type': 'application/json'}
            });
            if (response.status === 200) {
                console.log('Juttu lisätty juttuun');
                setPostMovieStatus(`${type === "tv" ? "Tv-sarja" : "Elokuva"} lisätty ryhmään`);
                setMovieOrTvPosted(true);
            }
        } catch (error) {
            console.log(error);
            if(error.response.status === 400 && error.response.data === 'Leffa tai sarja on jo ryhmässä') {
                setPostMovieStatus('Kohde on jo lisätty ryhmään');
            } else {
                console.error('Virhe lisättäessä tapahtumaa ryhmään:', error);
                setPostMovieStatus('Virhe lisättäessä kohdetta ryhmään');
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

    // TODO: movieOrTvShowObject does not exist, replace with correct object
    const type_fin = type === 'tv' ? 'tv-sarja' : 'elokuva';
    return (
        <div className={styles.selectGroup}>
            <h3 className={styles.header}>Lisää {type_fin} {title} ryhmään</h3>
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
                <p className={styles.status}>{postMovieStatus}</p>
                <div className={styles.buttons}>
                    <button onClick={postEvent}>Lisää</button>
                    <button onClick={closeForm}>Paluu</button>
                </div>
            </div>
        </div>
    )
}

export default PostMovieOrTvShowToGroup