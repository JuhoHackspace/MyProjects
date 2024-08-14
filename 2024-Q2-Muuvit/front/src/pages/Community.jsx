import React, {useEffect, useRef, useState} from 'react'
import CreateGroups from "@content/CreateGroups.jsx";
import ShowReviews from "@content/ShowReviews.jsx";
import styles from "./css/Community.module.css";
import AllGroupsList from "@content/AllGroupsList.jsx";
import {useLoginData} from "@context/useLoginData.jsx";
import ShowMyGroups from "@content/ShowMyGroups.jsx";
import Notice from "@content/Notice.jsx";

/**
 * Community component for showing the community page.
 * @returns {Element}
 */


const Community = () => {

    const [groupCreated, setGroupCreated] = useState(false);
    const [groupCreatedError, setGroupCreatedError] = useState(false);
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');

    const creds = useLoginData();

    useEffect(() => {
        setTimeout(() => {
            setGroupCreated(false);
        }, 4500);
    }, [groupCreated]);

    useEffect(() => {
        setTimeout(() => {
            setGroupCreatedError(false);
        }, 4500);
    }, [groupCreatedError]);

    const setErrorMessage = (error) => {
        console.log(error)
        if (error.response?.status === 400 && error.response?.data?.msg === "Virhe luotaessa ryhmää. Ehkä se on jo olemassa?") {
            setError("Ryhmän luonti epäonnistui. Onko ryhmä jo olemassa?")
        } else if (error.response?.status === 400 && error.response?.data?.msg === "Ryhmän nimi tai kuvaus puuttuu") {
            setError("Ryhmän luonti epäonnistui. Täytä ryhmän nimi ja kuvaus.") 
        } else if (error.response?.status === 403) {
            setError("Ryhmän luonti epäonnistui. Kirjaudu sisään luodaksesi ryhmän.")
        } else {
            setError("Ryhmän luonti epäonnistui.")
        }
        setGroupCreatedError(true);
    }


    // Show create groups and show all groups
    const [showCreateGroups, setShowCreateGroups] = useState(false);
    const [showAllGroups, setShowAllGroups] = useState(false);
    const [showMyGroups, setShowMyGroups] = useState(false);

    const toggleCreateGroups = () => {
        setShowCreateGroups(!showCreateGroups);
        setShowAllGroups(false);
        setShowMyGroups(false);
    }
    const toggleAllGroups = () => {
        setShowCreateGroups(false);
        setShowAllGroups(!showAllGroups);
        setShowMyGroups(false);
    }
    const toggleMyGroups = () => {
        setShowCreateGroups(false);
        setShowAllGroups(false);
        setShowMyGroups(!showMyGroups);
    }


    const [groupCreatedMessagePosition, setGroupCreatedMessagePosition] = useState({left: 0, top: 0});
    const groupCreatedMessageRef = useRef(null);
    const groupNotCreatedMessageRef = useRef(null);

    useEffect(() => {
        console.log(groupCreatedMessageRef.current)
        setGroupCreatedMessagePosition(calculateDivPosition(groupCreatedMessageRef));
    }, [groupCreated])

    useEffect(() => {
        console.log(groupNotCreatedMessageRef.current)
        setGroupCreatedMessagePosition(calculateDivPosition(groupNotCreatedMessageRef));
    }, [groupCreatedError])

    const calculateDivPosition = (someRef) => {
        if (someRef.current) {
            const rect = [someRef.current.offsetWidth, someRef.current.offsetHeight];
            const screenWidth = window.innerWidth;
            const left = (screenWidth - rect[0]) / 2;
            const top = (window.innerHeight - rect[1]) / 2;

            const result = {left, top, transform: `rotate(${Math.random()*30-15}deg)`}
            console.log(result)
            return result
        }
        return null;
    }

    const setGroupCreatedMessageRef = node => {
        if (node !== null) {
            const position = calculateDivPosition(node);
            setGroupCreatedMessagePosition(position);
        }
    };


    return (
        <div className={styles.container}>
            <h2>Yhteisö</h2>

            <div className={styles.buttonContainer}>
                <button className={styles.buttonStyle}
                    onClick={toggleAllGroups}>{showAllGroups ? "Piilota ryhmät" : "Näytä ryhmät"}</button>
                {creds.token && <button className={styles.buttonStyle}
                        onClick={toggleCreateGroups}>{showCreateGroups ? "Piilota ryhmän luonti" : "Luo ryhmä"}</button>}
                {creds.token && <button className={styles.buttonStyle} onClick={toggleMyGroups}>{showMyGroups ? "Piilota ryhmäni" : "Näytä ryhmäni"}</button>}
            </div>
            {showMyGroups && <ShowMyGroups/>}
            {showAllGroups && <AllGroupsList showAllGroups={showAllGroups}/>}
            {showCreateGroups && (
                <CreateGroups
                    onCreateGroup={(groupName, groupDescription) => {
                        setGroupCreated(!groupCreated)
                        setGroupName(groupName)
                    }}
                    onError={(err) => {
                        setErrorMessage(err);
                    }}/>)}
            {groupCreated && <Notice
                ref={groupCreatedMessageRef}
                noticeText={`Ryhmä ${groupName} luotu onnistuneesti!`}
                position={groupCreatedMessagePosition}
                noticeHeader={"Ryhmän luonti onnistui"}
                showSeconds={4}
                setNotice={(a) => {}}
            />}
            {groupCreatedError && <Notice
                ref={groupNotCreatedMessageRef}
                noticeText={`${error}`}
                position={groupCreatedMessagePosition}
                noticeHeader={"Ryhmän luonti epäonnistui"}
                showSeconds={4}
                setNotice={(a) => {}}
            />}
            <hr className={styles.theHr}/>

            <ShowReviews/>
        </div>
    )
        ;
};

export default Community;