import React from 'react'
import { useEffect, useState } from 'react'
import { useLoginData} from '../../context/useLoginData';
import axios from 'axios'
import PaginatorNavigateMenu from './Movies/PaginatorNavigateMenu';
import styles from './css/ViewGroupSeries.module.css'

/**
 * ViewGroupSeries component for viewing the series posted to the group.
 * @param group_id The id of the group.
 * @returns {Element}
 */


export default function ViewGroupSeries({group_id}) {
    const loginData = useLoginData()
    const [series, setSeries] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [statusMessage, setStatusMessage] = useState('Ei sarjoja')

    const getSeries = async () => {

        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/movie/private/group/getGroupContent/tv/${group_id}/${page}`, {
                withCredentials: true,
                headers: { Authorization: `bearer ${loginData.token}` }
            })
            if (response.status === 200) {
                if(response.data.content.length > 0) {
                    console.log('Sarjat:', response.data.content)
                    setSeries(response.data.content)
                    setTotalPages(response.data.numPages)
                    setPage(response.data.currentPage)
                    setStatusMessage('Sarjat')
                } else {
                    setStatusMessage('Ei sarjoja')
                }
            }
        }
        catch (error) {
            console.error('Virhe haettaessa sarjoja:', error)
            setStatusMessage('Virhe haettaessa sarjoja')
        }
    }

    useEffect(() => {
        getSeries()
    }, [page])

    return (
        <div className={styles.groupSeries}>
        
                            {series.length > 0 ?
                            <PaginatorNavigateMenu currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                            : <h2>{statusMessage}</h2>}
                            <ul className={styles.serieList}>
                            {series.map(serie => (
                                                <div className={styles.serieCard} key={serie.id}>
                                                        <h3>{serie.original_name}</h3>
                                                        <span><p>{serie.tagline}</p></span>
                                                        <p>{serie.overview}</p>
                                                </div>
                                                ))}
                            </ul>
        </div>
                )
}
