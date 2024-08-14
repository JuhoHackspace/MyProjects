import React from 'react'
import styles from './css/BackdropMovieOrSerie.module.css';

/**
 *
 * @param type //movie or tv
 * @param MovieOrSerieObject//Object with movie or serie data (from TMDB). This object is returned from the backend API. eq. "fetchDetails". 
 * @returns {Element}
 */


export default function BackdropMovieOrSerie({type, MovieOrSerieObject}) {
  return (
    <div className={styles.infoBackdrop}>
        <div className={styles.upperInfo}>
            <div className={styles.image_wrapper}>
                <img className={styles.backdropImg} src = {`https://image.tmdb.org/t/p/w500${MovieOrSerieObject.poster_path}`} alt='poster'/>
            </div>
            <div className={styles.rightInfo}>
                <h3 className={styles.title_}>{type === 'movie' ? MovieOrSerieObject.original_title : MovieOrSerieObject.original_name}</h3>
                <p className={styles.description}>{type === 'movie' ? MovieOrSerieObject.overview : MovieOrSerieObject.overview}</p>
            </div>
        </div>
        <div className={styles.lowerInfo}>
            <p className={styles.score}>TMDB score: {MovieOrSerieObject.vote_average}</p>
            <p className={styles.published}>{type === 'movie' ? 'Published: ' + MovieOrSerieObject.release_date : 'First airing: ' + MovieOrSerieObject.first_air_date}</p>
            <p className={styles.genres}>Genres: {MovieOrSerieObject.genres.map(genre => genre.name).join(', ')}</p>
            <p className={styles.languages}>Languages: {MovieOrSerieObject.spoken_languages.map(language => language.name).join(', ')}</p>
        </div>    
    </div>
  )
}
