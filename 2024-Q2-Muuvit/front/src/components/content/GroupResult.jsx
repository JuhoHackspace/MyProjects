
import styles from './css/GroupResult.module.css';
import axios from "axios";
import {useLoginData} from "@context/useLoginData.jsx";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

/**
 * GroupResult komponentti esittää yksittäisen ryhmän tiedot.
 * @param name Ryhmän nimi
 * @param description Ryhmän kuvaus
 * @param memberCount Ryhmän jäsenmäärä
 * @param id Ryhmän id
 * @param onRequestedJoinGroup Callback, joka kutsutaan axioksen response parametrillä kutsun onnistuessa
 * @param onFailRequestedJoinGroup Callback, joka kutsutaan axioksen error parametrillä kutsun epäonnistuessa
 * @returns {JSX.Element}
 * @constructor
 */
const GroupResult = ({ name, description, memberCount, groupId, onRequestedJoinGroup, onFailRequestedJoinGroup }) => {

    const [membershipPending, setMembershipPending] = useState(false);
    const [isGroupMember, setIsGroupMember] = useState(false);
    const creds = useLoginData();
    const requestToJoinGroup = () => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/private/joingroup/${groupId}`, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${creds.token}`
            }
        }).then(response => {
            setMembershipPending(true);
            onRequestedJoinGroup(response);
        }).catch(error => {
            onFailRequestedJoinGroup(error);
        });
    }

    const navigate = useNavigate();
    const showGroupPage = () => {
        navigate(`/groups/private/group/${groupId}`);
    }

    useEffect(() => {
        // Query whether member is a member of the group
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/private/groupData/${groupId}`, {
            withCredentials: true,
            headers: {
                "Authorization": `Bearer ${creds.token}`
            }
        }).then(response => {
            setMembershipPending(response
                .data.participantRegistrations
                .filter(x => x.status === 'pending' && x.user.username === creds.userName).length === 1);
            setIsGroupMember(response
                .data.participantRegistrations
                .filter(x => x.status !== 'pending' && x.user.username === creds.userName).length === 1);
        }).catch(error => {
            console.error(error);
        });
    }, []);

    return (
        <div className={styles.container}>
            <h3>{name}</h3>
            <p>{memberCount} jäsentä</p>
            <p>{description}</p>
            <div className={styles.buttons}>
                {!isGroupMember && creds.token && <button className={styles.button} onClick={requestToJoinGroup} disabled={membershipPending}>{membershipPending ? "Olet jo pyytänyt liittyä" : "Pyydä liittyä ryhmään"}</button>}
                {isGroupMember && <button className={styles.button} onClick={showGroupPage} >Näytä ryhmäsivu</button>}
            </div>
        </div>
    );
}

export default GroupResult;