import React from 'react'
import { useLoginData } from '@context/useLoginData';
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './css/ResolveRequests.module.css';

/**
 * ResolveRequests component for resolving group membership requests.
 * @param group_id The id of the group.
 * @param pendingRequests The array of pending requests.
 * @param setPendingRequests The function to set the pending requests.
 * @param setRefresh The function to set the refresh. This refreshes the group data in the parent component.
 * @returns {Element}
 */


export default function ResolveRequests({group_id, pendingRequests, setPendingRequests, setRefresh}) {

const loginData = useLoginData();
  

const acceptOrDeclineRequest = async (username, chosenStatus) => {
    console.log('Resolvin request for user :', username, " with status: ", chosenStatus);
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/private/resolveRequest/${group_id}/${username}/${chosenStatus}`,
            {
            withCredentials: true,
            headers: {
                Authorization: `bearer ${loginData.token}`
            }
            });

        if (response.status === 200) {
            const updatedRequests = pendingRequests.map((pendingRequest) => {
            if (pendingRequest.username === username) {
                return { ...pendingRequest, status: chosenStatus === 'accepted' ? 'hyväksytty' : 'hylätty'};
            }
            return pendingRequest;
            });
            setPendingRequests(updatedRequests);
            setRefresh(true);
        }
        } catch (error) {
        // Handle the error
        console.error('Error accepting request:', error);
    }
};

useEffect(() => {

}, [pendingRequests, setPendingRequests, setRefresh]);
     
return (
        <div className={styles.openRequests}>
            {pendingRequests.length === 0 ? (
                <h2>Ei avoimia pyyntöjä</h2>
            ) : (
                pendingRequests.map((pendingRequest) => (
                    <div className={styles.request}>
                        <div className={styles.left}>
                            <span className={styles.username} key={pendingRequest.username}>Käyttäjä: {pendingRequest.username}</span>
                            <span className={styles.memberStatus}>{pendingRequest.status}</span>
                        </div>
                        {pendingRequest.status === 'Odottaa hyväksyntää' && <div className={styles.buttons}>
                            <button className={styles.leftButton} onClick={() => acceptOrDeclineRequest(pendingRequest.username, "accepted")}>Hyväksy</button>
                            <button className={styles.rightButton} onClick={() => acceptOrDeclineRequest(pendingRequest.username, "declined")}>Hylkää</button>
                        </div>}
                    </div>
                ))
            )}
        </div>
    )
}
