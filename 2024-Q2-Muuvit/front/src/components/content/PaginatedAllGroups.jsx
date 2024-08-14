import PaginatorNavigateMenu from "@content/Movies/PaginatorNavigateMenu.jsx";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import GroupResult from "@content/GroupResult.jsx";
import styles from './css/PaginatedAllGroups.module.css';

/**
 * PaginatedAllGroups component for displaying all groups in paginated form.
 * @param onError The function to call when an error occurs.
 * @returns {Element}
 */


const PaginatedAllGroups = ({onError}) => {

    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [pageData, setPageData] = useState([]);

    const [showJoinGroupRequestSuccess, setShowJoinGroupRequestSuccess] = useState(false);
    const [showJoinGroupRequestFail, setShowJoinGroupRequestFail] = useState(false);
    const [joinGroupMessage, setJoinGroupMessage] = useState('');

    const ref = useRef(null);
    const errorMsgRef = useRef(null);
    const successMsgRef = useRef(null);


    useEffect(() => {
        getData(page).then((data) => {
            setNumPages(data.numPages);
            setPageData(processPageData(data.groups));
        }).catch((error) => {
            console.error(error);
            onError && onError(error);
        })
    }, [])

    useEffect(() => {
        getData(page).then((data) => {
            setPageData(processPageData(data.groups));
        }).catch((error) => {
            console.error(error);
            onError && onError(error);
        })
    }, [page])

    const getData = async (page) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/group/groupslist/${page}`)
            return response.data;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    const onRequestJoinGroup = (response) => {
        setJoinGroupMessage(response.data);
        setShowJoinGroupRequestSuccess(true);
    }

    const onFailRequestJoinGroup = (error) => {
        setJoinGroupMessage(error.response.data);
        setShowJoinGroupRequestFail(true);
    }

    const processPageData = (groupsData) => {
        return groupsData.map((group) => {
            return (<GroupResult
                key={group.groupId}
                name={group.groupName}
                description={group.groupDescription}
                memberCount={group.participantRegistrations.filter(x => x.status !== 'pending').length}
                groupId={group.groupId}
                onRequestedJoinGroup={onRequestJoinGroup}
                onFailRequestedJoinGroup={onFailRequestJoinGroup}
            />)
        })
    }

    useEffect(() => {
        if (showJoinGroupRequestSuccess) {
            setTimeout(() => {
                setShowJoinGroupRequestSuccess(false);
            }, 3000);
            const pos = calculateDivPosition(successMsgRef);
            successMsgRef.current.style.left = `${pos[0]}px`;
            successMsgRef.current.style.top = `${pos[1]}px`;
        } else if (showJoinGroupRequestFail) {
            setTimeout(() => {
                setShowJoinGroupRequestFail(false);
            }, 3000);
            const pos = calculateDivPosition(errorMsgRef);
            errorMsgRef.current.style.left = `${pos[0]}px`;
            errorMsgRef.current.style.top = `${pos[1]}px`;
        }
    }, [showJoinGroupRequestSuccess, showJoinGroupRequestFail, joinGroupMessage]);

    const calculateDivPosition = (someRef) => {
        if (someRef.current) {
            const rect = [someRef.current.offsetWidth, someRef.current.offsetHeight];
            const screenWidth = window.innerWidth;
            const left = (screenWidth - rect[0]) / 2;
            const top = (window.innerHeight - rect[1]) / 2;

            return [left, top];
        }
        return null;
    }

    return (
        <>
            <div ref={errorMsgRef} className={showJoinGroupRequestFail ? styles.showError : styles.dontShowError}>
                <p>{joinGroupMessage}</p>
            </div>
            <div ref={successMsgRef} className={showJoinGroupRequestSuccess ? styles.showSuccess : styles.dontShowSuccess}>
                <p>{joinGroupMessage}</p>
            </div>
            <div className={styles.centerPaginator} ref={ref}>
                <PaginatorNavigateMenu currentPage={page} totalPages={numPages} onPageChange={setPage}/>
            </div>
            <div className={styles.pageDataContainer}>
                {pageData}
            </div>
            <div className={styles.centerPaginator}>
                <PaginatorNavigateMenu currentPage={page} totalPages={numPages} onPageChange={setPage}/>
            </div>
        </>
    )
}

export default PaginatedAllGroups;