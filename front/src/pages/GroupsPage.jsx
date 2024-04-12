import styles from './css/GroupPage.module.css';
import '../index.css'
import React from "react";
import axios from 'axios';
import {useState} from 'react';
import {useLoginData} from '../context/useLoginData';
import AllGroupsList from "@pages/AllGroupsList.jsx";


const GroupsPage = () => {

    const loginData = useLoginData();

    {/* Uusien ryhmien rekisteröinti */
    }
    const [showAllgroups, setShowAllGroups] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');

    const createGroup = (ev) => {
        return axios.post(`${import.meta.env.VITE_BACKEND_URL}/group/private/create`, {
            groupName: groupName,
            description: groupDescription
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            }
        }).then((response) => {
            return response;
        }).catch((error) => {
            console.log("token:", loginData.token);
            console.log(error)
            return error
        })
    }

    // {/* Kaikkien ryhmien haku, myos kirjautumattomat saavat hakea */}
    // const getAllGroups = () => {
    //     setShowAllGroups(true);
    //     console.log('getAllGroups');
    // }

    {/* Kirjautuneen käyttäjän omien ryhmien haku */}
    const getOwnGroups = () => {
        console.log('getOwnGroups');
    }


    return (
        <>
            <h2>Ryhmät</h2>

            {/* Uusien ryhmien rekisteröinti */}
            <div className={styles.groupForm}>
                <label className={styles.groupNameLabel} htmlFor="group-name">Ryhmän nimi:</label>
                <input
                    className={styles.groupNameInput}
                    onChange={(ev) => setGroupName(ev.target.value)}
                    value={groupName}
                    type="text"
                    id="group-name"
                    name="group-name"
                    required/>
                <label className={styles.groupDescriptionLabel} htmlFor="group-description">Kuvaus:</label>
                <textarea
                    className={styles.groupDescriptionInput}
                    onChange={(ev) => setGroupDescription(ev.target.value)}
                    value={groupDescription}
                    id="group-description"
                    name="group-description"
                    required/>
                <button type="button" onClick={createGroup}>Luo ryhmä</button>
            </div>

            <div id="buttons">
                <button className="button" onClick={getOwnGroups}>Hae omat ryhmät</button>
            </div>
            {<AllGroupsList setShowAllGroups={setShowAllGroups} />}
        </>
    )
}

export default GroupsPage;