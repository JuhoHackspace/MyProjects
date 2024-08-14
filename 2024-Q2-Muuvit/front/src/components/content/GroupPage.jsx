import {useParams} from 'react-router-dom';
import {useEffect, useState} from "react";
import axios from "axios";
import styles from "./css/GroupPage.module.css";
import {useLoginData} from "@context/useLoginData.jsx";
import ViewGroupEvents from './ViewGroupEvents';
import {useNavigate} from "react-router-dom";
import ResolveRequests from './ResolveRequests';
import PaginatorNavigateMenu from "@content/Movies/PaginatorNavigateMenu.jsx";
import ViewGroupSeries from './ViewGroupSeries';

/**
 * GroupPage component is used to show the group page for a specific group.
 * @returns {Element}
 */


const GroupPage = () => {
    const [groupData, setGroupData] = useState(null);
    const [members, setMembers] = useState();
    const {groupId} = useParams();
    const [showEvents, setShowEvents] = useState(false);
    const loginData = useLoginData();
    const [userIsOwner, setUserIsOwner] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const creds = useLoginData();
    const [joinRequests, setJoinRequests] = useState([]);
    const [showResolveRequests, setShowResolveRequests] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [showMembers, setShowMembers] = useState(false);

    const processMembers = (members) => {
        if (members === undefined) return [];
        console.log("members: ", members);
        return members
            .filter((member) => member.status === "accepted" || member.status === "owner")
            .map((member) => {
                const username = member.user && member.user.username ? member.user.username : "Unknown";
                const status = member.status;
                const executeMemberDelete = <button className={styles.deletemember} onClick={() => {
                    deleteUserFromGroup(groupId, member.user.id)
                }}>erota</button>
                return <li key={member.usersToGroupsId}>{username} <span
                    className={styles.memberStatus}>{status === "accepted" ? "member" : "owner"}</span>{userIsOwner && status !== "owner" && executeMemberDelete}
                </li>
            })
    }

    const processOwner = (members) => {
        if (members === undefined) return [];
        return members.filter((member) => member.status === "owner")
            .map((member) => {
                const username = member.user && member.user.username ? member.user.username : "Unknown";
                if (username === loginData.userName) {
                    setUserIsOwner(true);
                }
            })
    }

    const getPendingRequests = (members) => {
        if (members === undefined) return [];
        return members.filter((member) => member.status === "pending")
            .map((member) => {
                console.log(member);
                const username = member.user && member.user.username ? member.user.username : "Unknown";
                const status = "Odottaa hyväksyntää"
                return {username, status};
            })
    }


    useEffect(() => {
        console.log(groupId)
        setRefresh(false)
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/private/groupData/${groupId}`,
            {
                withCredentials: true,
                headers: {
                    Authorization: `bearer ${loginData.token}`
                }
            })
            .then(response => {
                setGroupData(response.data)
            })
            .catch(error => {
                console.log(error)
            })
    }, [refresh])

    useEffect(() => {
        if (groupData) {
            processOwner(groupData.participantRegistrations)
            setMembers(processMembers(groupData.participantRegistrations))
            setJoinRequests(getPendingRequests(groupData.participantRegistrations))
        }
    }, [groupData])

    const [deleteGroupStatus, setDeleteGroupStatus] = useState({note: '', success: null, msg: ''})
    const navigate = useNavigate()
    const handleDeleteGroup = (ev) => {

        setDeleteGroupStatus({note: '\'poista ryhmä\'-viesti', success: null, msg: 'lähetetty'})
        ev.preventDefault()
        axios({
            url: `${import.meta.env.VITE_BACKEND_URL}/group/private/deleteGroup/${groupId}`,
            method: 'delete',
            withCredentials: true,
            headers: {
                allow: 'application/json',
                "Authorization": `Bearer ${loginData.token}`
            }
        }).then(function (response) {
            setDeleteGroupStatus({success: true, msg: 'Ryhmän poistaminen onnistui'})
            navigate(-1);
        }).catch(function (err) {

            if (err.message == "Network Error") {
                console.log('haloo')
                console.log(err.status)
                console.log(err)
                setDeleteGroupStatus({note: '\'poista ryhmä\'-viesti', success: false, msg: 'Ei yhteyttä tietokantaan'})
            } else {
                console.log(err)
                console.log(err.status)
                console.log(err.message)
                setDeleteGroupStatus({note: '\'poista ryhmä\'-viesti', success: false, msg: 'tunnistamaton virhe'})
            }

        })

    }


    const refreshData = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/private/groupData/${groupId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `bearer ${loginData.token}`
                    }
                })
            setGroupData(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const deleteUserFromGroup = async (groupId, userId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/group/private/deleteGroupMember/${groupId}/${userId}`,
                {
                    withCredentials: true,
                    headers: {
                        Authorization: `bearer ${loginData.token}`
                    }
                })
            await refreshData()
        } catch (error) {
            console.log(error)
        }
    }

    const [showGroupMovies, setShowGroupMovies] = useState(false);
    const [groupMovies, setGroupMovies] = useState();
    const [moviesPage, setMoviesPage] = useState(1);
    const [numMoviesPages, setNumMoviesPages] = useState(1);

    const updateMovies = () => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/movie/private/group/getGroupContent/movie/${groupId}/${moviesPage}`,
            {
                withCredentials: true,
                headers: {
                    Authorization: `bearer ${loginData.token}`
                }
            })
            .then(response => {
                console.log("response.data:",response.data)
                setNumMoviesPages(response.data.numPages)
                setGroupMovies(response.data.content.map(movie => {
                    return <div className={styles.movieCard} key={movie.movieId}>
                        <h3>{movie.title}</h3>
                        <span><p>{movie.tagline}</p></span>
                        <p>{movie.overview}</p>
                    </div>
                }))
            })
            .catch(error => {
                console.log(error)
            })
    }

    useEffect(() => {
        updateMovies();
    }, [moviesPage])

    const [showGroupSeries, setShowGroupSeries] = useState(false);

    return (
        <div className={styles.page}>
            <div className={styles.section}>
                <h1 className={styles.title}>Ryhmän <span>{groupData?.groupName}</span> -sivu</h1>
                {userIsOwner && <button onClick={handleDeleteGroup}>Poista ryhmä</button>}
            </div>

            <p className={styles.description}>{groupData?.groupDescription}</p>
            <div className={styles.infoText}><p>{deleteGroupStatus.msg}</p></div>
            <hr className={styles.horizontalRuler}/>
            <div className={styles.section}>
                <h2>Ryhmän jäsenet</h2>
                <button onClick={() => setShowMembers(!showMembers)}>{showMembers ? 'Piilota' : 'Näytä'}</button>
            </div>
            {showMembers &&
                <div>
                    <ul>
                        {members}
                    </ul>
                </div>}
            <hr className={styles.horizontalRuler}/>
            {userIsOwner &&
                <>
                    <div className={styles.section}>
                        <h2>Ryhmän liittymispyynnöt</h2>
                        <button
                            onClick={() => setShowResolveRequests(!showResolveRequests)}>{showResolveRequests ? 'Piilota' : 'Näytä'}</button>
                    </div>
                    {showResolveRequests && <ResolveRequests group_id={groupId} pendingRequests={joinRequests}
                                                             setPendingRequests={setJoinRequests}
                                                             setRefresh={setRefresh}/>}
                    <hr className={styles.horizontalRuler}/>
                </>}

            <div className={styles.section}>
                <h2>Ryhmän elokuvat</h2>
                <button onClick={() => {
                    setShowGroupMovies(!showGroupMovies);
                    updateMovies();
                }}>{showGroupMovies? 'Piilota': 'Näytä'}
                </button>
            </div>
            {showGroupMovies &&
                <div className={styles.movies}>
                    {groupMovies.length === 0 ? <h2>Ei elokuvia</h2> :
                    <>
                    <PaginatorNavigateMenu currentPage={moviesPage} onPageChange={setMoviesPage} totalPages={numMoviesPages}/>
                    <ul className={styles.moviesList}>
                        {groupMovies}
                    </ul>
                    </>}
                </div>
            }

            <hr className={styles.horizontalRuler}/>

            <div className={styles.section}>
                <h2>Ryhmän sarjat</h2>
                <button onClick={() => setShowGroupSeries(!showGroupSeries)}>{showGroupSeries ? 'Piilota': 'Näytä'}</button>
            </div>

            {showGroupSeries &&
                <ViewGroupSeries group_id={groupId}/>}

            <hr className={styles.horizontalRuler}/>

            <div className={styles.section}>
                <h2>Ryhmän näytökset</h2>
                <button onClick={() => setShowEvents(!showEvents)}>{!showEvents ? 'Näytä' : 'Piilota'}</button>
            </div>
            {showEvents && <ViewGroupEvents group_id={groupId} isOwner={userIsOwner}/>}
            <hr className={styles.horizontalRuler}/>

        </div>
    );
}

export default GroupPage;
