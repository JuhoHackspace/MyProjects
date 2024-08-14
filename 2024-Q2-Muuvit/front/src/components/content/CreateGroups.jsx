import styles from '@content/css/CreateGroup.module.css';
import React, {useEffect} from "react";
import axios from 'axios';
import {useState} from 'react';
import {useLoginData} from '@context/useLoginData.jsx';

/**
 * CreateGroups komponentti esittää formin jolla voi luoda uusia ryhmiä.
 * @param onCreateGroup -funktio saa parametreinään ryhmän nimen ja kuvauksen. Funktiolla ei ole paluuarvoa.
 * @param onError -funktio saa parametreinään virheen kuvauksen. Funktiolla ei ole paluuarvoa.
 * @returns {Element}
 * @constructor
 */
const CreateGroups = ({onCreateGroup, onError}) => {

    const loginData = useLoginData();

    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [triggerOnCreateGroup, setTriggerOnCreateGroup] = useState(false);
    const [triggerOnError, setTriggerOnError] = useState(false);
    const [responseOrError, setResponseOrError] = useState(null);
    const [disableSubmit, setDisableSubmit] = useState(false);

    const createGroup = (ev) => {
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/group/private/create`, {
            groupName: groupName,
            description: groupDescription
        }, {
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginData.token}`
            }
        }).then((response) => {
            console.log("Ryhmän luonti:", response.data);
            setTriggerOnCreateGroup(true);
            setResponseOrError(response);
            setDisableSubmit(true);
        }).catch((error) => {
            setTriggerOnError(true);
            setResponseOrError(error);
        })
    }

    useEffect(() => {
        if (triggerOnCreateGroup && onCreateGroup) {
            onCreateGroup(groupName, groupDescription);
        } else if (triggerOnError && onError) {
            onError(responseOrError);
        }
        setTriggerOnCreateGroup(false);
        setTriggerOnError(false);
    }, [triggerOnCreateGroup, triggerOnError]);

    return (
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
        <button className={styles.theButton} type="button" onClick={createGroup} disabled={disableSubmit}>Luo ryhmä
        </button>
    </div>
)
}

export default CreateGroups;