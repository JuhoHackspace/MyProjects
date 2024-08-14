import {useEffect, useState} from "react";
import axios from "axios";
import ShowReview from "@content/ShowReview.jsx";
import styles from './css/ShowReviews.module.css'
import PaginatorNavigateMenu from "@content/Movies/PaginatorNavigateMenu.jsx";
import Backdrop from "@content/Backdrop.jsx";
import BackdropMovieOrSerie from "@content/BackdropMovieOrSerie.jsx";

/**
 * ShowReviews component is used to show reviews.
 * @returns {Element}
 */


const ShowReviews = () => {

    const [reviews, setReviews] = useState(null);
    const [page, setPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [resultsOnPage, setResultsOnPage] = useState(5);
    const [showBackdrop, setShowBackdrop] = useState(false);
    const [backdropData, setBackdropData] = useState({type: '', object: {}});

    const getReviews = (page) => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/review/getReviews/${page || 1}`)
            .then(response => {
                setReviews(response.data);
                setNumPages(response.data.numPages);
                setResultsOnPage(response.data.pageSize);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        getReviews(1)
    }, []);

    useEffect(() => {
        getReviews(page)
    }, [page]);

    const onPageChange = (newPage) => {
        setPage(newPage);
        console.log(newPage)
    }

    const closeBackdrop = () => {
        setShowBackdrop(false);
    }

    return (
        <>
            {showBackdrop && <Backdrop onClose={closeBackdrop}>
                            <BackdropMovieOrSerie type={backdropData.type} MovieOrSerieObject={backdropData.object} />
                        </Backdrop>}
            <div className={styles.paginatorContainer}>
                <PaginatorNavigateMenu
                    currentPage={page}
                    totalPages={numPages}
                    onPageChange={onPageChange}/>
            </div>

            <div className={styles.reviewsContainer}>
                {reviews?.reviews.map((review) => {
                    return (
                        <ShowReview
                            key={review.reviewId}
                            review={review}
                            setBackdropData={setBackdropData}
                            setShowBackdrop={setShowBackdrop}
                        />
                    )
                })}
            </div>
            <div className={`${styles.paginatorContainer} ${styles.bottomPaginator}`}>
                <PaginatorNavigateMenu
                    currentPage={page}
                    totalPages={numPages}
                    onPageChange={onPageChange}/>
            </div>
        </>
    );
}

export default ShowReviews;