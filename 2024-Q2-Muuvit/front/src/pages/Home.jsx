import React, {useState, useEffect} from 'react';
import styles from'./css/Home.module.css';
import Backdrop from "@content/Backdrop.jsx";
import axios from 'axios';
import { differenceInCalendarQuarters } from 'date-fns';

/**
 * Home component is used to show the home page.
 * @returns {Element}
 */


const tmdbImageFilePath = 'https://image.tmdb.org/t/p/w1280/'

const Home = () => {

    const [carouselleImage, setCarouselleImage] = useState('')
    const [carouselleTitle, setCarouselleTitle] = useState('')
    const [carouselleOverview, setCarouselleOverview] = useState('')
    const [imgNum, setImgNum] = useState(0)
    const [timerIsSet, setTimerIsSet] = useState(false);
    const [movieData, setMovieData] = useState([])
    const [movieDataFound , setMovieDataFound] = useState(false)

    useEffect(() => {
        if(movieDataFound) {
            const timer = setInterval(() => {
                setImgNum((prevImgNum) => (prevImgNum + 1) % movieData.length);
            }, 10000);
            return () => clearInterval(timer);
        }
    },[movieDataFound]);
  
    useEffect(() => {
        const changeImage = () => {
            console.log(movieData, movieData.length, imgNum)
            if(!movieData[imgNum].overview || !movieData[imgNum].title || !movieData[imgNum].backdrop_path) {
                console.error('Movie data or part of it is missing')
                setImgNum((prevImgNum) => (prevImgNum + 1) % movieData.length);
            }
            setCarouselleImage(tmdbImageFilePath + movieData[imgNum].backdrop_path)
            setCarouselleTitle(movieData[imgNum].title)
            setCarouselleOverview(movieData[imgNum].overview)
        }
        if(movieDataFound) {
            changeImage()
        }
    },[imgNum, movieDataFound]);

    useEffect(() => {
        getMovies()
        .then((response) => {
            console.log(response.status)
            if(response.data.results.length > 0) {
                setMovieData(response.data.results)
                setMovieDataFound(true)
            }else {
                console.error('No movie data found')
            }
            console.log(movieData)
        })
    },[])
    
    const getMovies = async () => {

        const url= `${import.meta.env.VITE_BACKEND_URL}/movie/movieCarouselle/getMovies`
        let response = await axios.get(url)

        if (response.status === 200) {   
            return response;
        } else {
            throw new Error('Error fetching data');
        }          
    }
            
    return (
        <div className = {styles.home}>
            <div className={styles.page}>
                <h2>Tervetuloa Muuvit -palveluun! </h2>
                <p>
                    Kaipaatko paikkaa, jossa intohimo elokuviin ja sarjoihin yhdistää meidät kaikki? Muuvit on portti
                    jännittävään yhteisöön, missä voit liittyä ryhmiin, lukea ja kirjoittaa arvosteluja sekä ylläpitää ja jakaa omia suosikkejasi. Lisäksi tarjoamme ainutlaatuisen
                    Finnkino-elokuvanäytöshakumme sekä kattavan leffahakumme, joiden avulla löydät helposti juuri sinua
                    kiinnostavat elokuvat ja sarjat.
                </p>
            </div>
            <div className={styles.lower}>
                <div className={styles.poster}>
                    <h2>{carouselleTitle ? carouselleTitle: ''}</h2>
                    <p><img src ={carouselleImage ? carouselleImage: ''} alt='elokuvan posterikuva'/>{carouselleOverview ? carouselleOverview: ''}</p>
                </div>
            </div>
        </div>
    )
}

export default Home;
