import GroupResult from "@content/GroupResult.jsx";
import styles from './css/ShowMyGroups.module.css'
import {useLoginData} from "@context/useLoginData.jsx";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import PaginatorNavigateMenu from "@content/Movies/PaginatorNavigateMenu.jsx";

/**
 * ShowMyGroups component is used to show groups that the user is a member of.
 * @param onError The function to handle errors.
 * @returns {Element}
 */


const ShowMyGroups = ({onError}) => {

    const [groupData, setGroupData] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const creds = useLoginData();
    const ref = useRef(null);

    const fetchData = () => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/private/mygroups/${page || 1}`, {
            withCredentials: true,
            headers: {
                'Authorization': `bearer ${creds.token}`
            }
        }).then(response => {
            setGroupData(response.data);
            setTotalPages(response.data.numPages);
        }).catch(error => {
            console.error('Virhe tapahtui', error);
            onError && onError(error);
        });
    }

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        fetchData();
        ref.current.scrollIntoView();
    }, [page]);

    return (
        <>
            <div className={styles.superContainer} ref={ref}>
                <PaginatorNavigateMenu currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
            <div className={styles.container}>
                {groupData.groups?.map(group => {
                    return (
                        <GroupResult
                            key={group.groupName}
                            name={group.groupName}
                            groupId={group.groupId}
                            description={group.groupDescription}
                            memberCount={group.participantRegistrations.filter(x => x.status !== 'pending').length}
                        />
                    )
                })}
            </div>
            <div className={styles.superContainer}>
                <PaginatorNavigateMenu currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
        </>
    );
}

export default ShowMyGroups;