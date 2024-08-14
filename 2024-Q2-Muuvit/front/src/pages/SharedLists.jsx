import React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import styles from '@content/css/ViewFavouritesList.module.css'
import PaginatorNavigateMenu from '../components/content/Movies/PaginatorNavigateMenu'
import Backdrop from '../components/content/Backdrop'
import BackdropMovieOrSerie from '../components/content/BackdropMovieOrSerie'
import axios from 'axios'

export default function SharedLists() {
    const { userName, shareSlur } = useParams()
    const [favourites, setFavourites] = useState([])
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [statusMessage, setStatusMessage] = useState('Suosikkilistasi on tyhjä')
    const [showBackdrop, setShowBackdrop] = useState(false)
    const [backdropData, setBackdropData] = useState({})
  
    const getFavourites = async () => {
        setFavourites([])
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/favourites/getFavouritesByShareSlur/${shareSlur}/${page}`);
            if (response.status === 200) {
                setTotalPages(response.data.numPages);
                setFavourites(response.data.favourites);
                if (response.data.favourites.length === 0) {
                    setStatusMessage(`Käyttäjän ${userName} suosikkilista on tyhjä`);
                }else { 
                    setStatusMessage(`Käyttäjän ${userName} suosikkilista`);
                }
                console.log('Suosikit: ', response.data);
            }
        } catch (error) {
            console.error('Virhe haettaessa suosikkeja:', error);
        }
    }

    useEffect(() => {
        getFavourites()
    }, [page])

    const activateBackdrop = (favourite) => {
        setBackdropData(favourite)
        setShowBackdrop(true)
    }

    const closeBackdrop = () => {
        setShowBackdrop(false)

    }
    
    return (
        <div className={styles.favourites}>
            <h2 className={styles.heading}>{statusMessage}</h2>
            {favourites.length > 0 && 
            <>
            <PaginatorNavigateMenu currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
                <div className={styles.container}>
                    <ul className={styles.favouritesList}>
                        {favourites.map(favourite => (
                        <div className={styles.favourite}>
                            <div className={styles.upper}>
                                <h3 className={styles.type} key={favourite.first.favouriteId}>{favourite.first.type == 'movie'? 'Elokuva':'Sarja'}</h3>
                            </div>
                            <li className={styles.title} onClick={() => activateBackdrop(favourite)}>{favourite.first.type === 'movie' ? favourite.second.original_title : favourite.second.original_name}</li>
                            
                        </div>
                        ))}
                    </ul>
                </div>
            <PaginatorNavigateMenu currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
            </>}
            {showBackdrop && <Backdrop onClose={closeBackdrop}>
                                <BackdropMovieOrSerie type={backdropData.first.type} MovieOrSerieObject={backdropData.second} />
                            </Backdrop>}
        </div>
    )
}
