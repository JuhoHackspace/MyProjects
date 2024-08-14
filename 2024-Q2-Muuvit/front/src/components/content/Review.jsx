import React, {useEffect, useState} from 'react';
import axios from 'axios'
import '../../index.css'
import styles from '@content/css/Review.module.css';
//import '@pages/css/Login.css'
//import '@content/css/Review.css'
import {useLoginData} from "../../context/useLoginData.jsx";
import {useParams} from "react-router-dom";
import { useNavigate } from "react-router-dom";

/**
 * Review component is used to review movies and TV-shows.
 * @param type // Type of the movie or TV-show.
 * @param id // ID of the movie or TV-show.
 * @param title // Title of the movie or TV-show.
 * @returns {Element}
 */


const Review = () => {
    const{type, id, title} = useParams()
    const [numberOfStars, setNumberOfStars] = useState(3)
    const [reviewData, setReviewData] = useState({
        "type": type,
        "movieId": id,
        "stars": 3,
        "description": "Teekannu"
    })
    const [reviewDescription, setReviewDescription] = useState('')
    const [tyyppi, setTyyppi] = useState('tyyppi')
    const [reviewStatus, setReviewStatus] = useState({success: null, msg: 'Ei lähetty'})
    const loginData = useLoginData()

    useEffect(() => {
        setReviewData({...reviewData, movieId: id, stars: numberOfStars, description: reviewDescription})
        setTyyppi(type=='tv' ? 'TV-sarja' : 'elokuva' )
    }, [numberOfStars, reviewDescription])

   const sendReview = (ev) => {
        if (reviewDescription.length < 1) {
            setReviewStatus({success: false, msg: 'Arvosteluteksti puuttuu'})
            ev.preventDefault()
            return
        }
        if(reviewDescription.length > 1000) {
            setReviewStatus({success: false, msg: 'Arvostelu ylittää 1000 merkin rajan'})
            ev.preventDefault()
            return
        }
        setReviewStatus({success: null, msg: 'Lähetetty'})
        ev.preventDefault()
        axios({
            url: `${import.meta.env.VITE_BACKEND_URL}/review/private/newReview`,
            method: 'post',
            data: reviewData,
            withCredentials: true,
            headers: {
                    allow: 'application/json',
                    "Authorization": `Bearer ${loginData.token}`
            }
        }).then(function (response) {
            console.log(response.status)
            console.log(response)
            setReviewStatus({success: true, msg: 'Arvostelun lisääminen onnistui'})
        }).catch(function (err ) {
            if (err.message=="Network Error") {
                console.log(err.status)
                console.log(err)
                setReviewStatus({success: false, msg: 'Ei yhteyttä tietokantaan'})
            } else {
                setReviewStatus({success: false, msg: 'tunnistamaton virhe'})
            }

        })
    }

    const onSelectChange = (ev) => {
        setNumberOfStars(ev.target.value);
    }

    const navigate=useNavigate()

    function handlePaluu() {
        console.log('hello4');

        navigate(-1);
    }

    
    

    return (
        <>
            <div className={styles.review}>
                <h2 className={styles.header}>Arvostele {tyyppi} {title}</h2>
                <div className={styles.stars}>
                    <p>Anna tähdet: </p>
                    <select className={styles.starsSelected} value={numberOfStars} onChange={onSelectChange}>
                        <option value="1">&#11088; [1/5] tähteä</option>
                        <option value="2">&#11088;&#11088; [2/5] tähteä</option>
                        <option value="3">&#11088;&#11088;&#11088; [3/5] tähteä</option>
                        <option value="4">&#11088;&#11088;&#11088;&#11088; [4/5] tähteä</option>
                        <option value="5">&#11088;&#11088;&#11088;&#11088;&#11088; [5/5] tähteä</option>
                    </select>
                </div>
                    <textarea className={styles.reviewText} placeholder="Kirjoita arvostelu tähän" value={reviewDescription} onChange={(ev) => {setReviewDescription(ev.target.value)}}></textarea>
                    <div className={styles.buttons}>
                        <button onClick={sendReview}>Lähetä arvostelu</button>
                        <button onClick={handlePaluu}>Palaa takaisin</button>
                    </div>
                <div className={styles.infoText}><p>{reviewStatus.msg}</p></div>
            </div>
            

        </>
    )
}

export default Review