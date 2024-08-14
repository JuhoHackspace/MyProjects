import {useEffect} from "react";
import {useState} from "react";
import axios from "axios";

import styles from './css/SearchMoviesForm.module.css';
import '../../../index.css';

/**
 * SearchMoviesForm component is used to search movies and TV-shows. It displays a form with input fields for
 * @param queryString The query string for the search.
 * @param setQueryString Function to set the query string.
 * @param genre The genre of the movie or TV-show.
 * @param setGenre Function to set the genre.
 * @param disableGenres Boolean value to disable genres.
 * @param year The year of the movie or TV-show.
 * @param setYear Function to set the year.
 * @param disableYear Boolean value to disable year.
 * @param moviesOrTV The type of the search.
 * @param setMoviesOrTV Function to set the type of the search.
 * @param genreNum The genre number of the movie or TV-show.
 * @param setGenreNum Function to set the genre number.
 * @returns {Element}
 */

const SearchMoviesForm = ({
                              queryString, setQueryString,
                              genre, setGenre, disableGenres,
                              year, setYear, disableYear,
                              moviesOrTV, setMoviesOrTV,
                                genreNum, setGenreNum
                          }) => {

    const [genres, setGenres] = useState({});

    /**
     * @param whichGenres Either "movie" or "tv"
     */
    const getGenres = (whichGenres) => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/${whichGenres === 'tv' ? 'tv' : 'movie'}/genres`)
            .then(response => {
                setGenres(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }

    useEffect(() => {
        getGenres(moviesOrTV.toLowerCase());
    }, []);

    useEffect(() => {
        getGenres(moviesOrTV.toLowerCase());
    }, [moviesOrTV]);

    const handleChange = (event) => {
        setQueryString(event.target.value);
    }

    const handleSelectChange = (event) => {
        setGenre(event.target.value ? Object.entries(genres).filter(
            ([key, value]) => key === event.target.value
        )[0][0] : "");
        console.log(genres)
        setGenreNum(event.target.value ? Object.entries(genres).filter(
            ([key, value]) => key === event.target.value
        )[0][1] : 0);
    }

    const handleChangeYear = (event) => {
        setYear(event.target.value);
    }

    const handleOnChangeRadio = (event) => {
        setMoviesOrTV(event.target.value);
    }

    return (
        <>
            <form className={styles.form}>
                <label className={styles.label}>Etsi elokuvia</label>
                <input className={styles.input}
                        type={"radio"}
                       name={"moviesOrTV"}
                       value={"Elokuvia"}
                       checked={moviesOrTV === "Elokuvia"}
                       onChange={handleOnChangeRadio}/>
                <label className={styles.label}>Etsi TV-sarjoja</label>
                <input type={"radio"}
                       className={styles.input}
                          name={"moviesOrTV"}
                          value={"TV"}
                          checked={moviesOrTV === "TV"}
                          onChange={handleOnChangeRadio}/>
            </form>
            <form className={styles.form}>
                <input type="text"
                       placeholder={moviesOrTV === "TV" ? "Etsi TV-sarjoja" : "Etsi elokuvia"}
                       value={queryString}
                       onChange={handleChange}
                       className={styles.input}/>
                <input type="number"
                       min={1895}
                       max={(new Date()).getFullYear()}
                       placeholder="Ensisijainen julkaisuvuosi"
                       value={year}
                       onChange={handleChangeYear}
                       className={styles.input}
                       disabled={disableYear}/>
                <input type="button" value={"Nollaa hakuvuosi"} onClick={() => setYear("")} className={styles.button}/>
                <select className={styles.select} onChange={handleSelectChange} disabled={disableGenres}>
                    <option value={""} className={styles.option}>--</option>
                    {Object.keys(genres).sort((a, b) => {
                        return a < b ? -1 : 1
                    }).map(
                        (genre, index) => {
                            return <option value={genre} key={genre} className={styles.option}>{genre}</option>
                        })
                    }
                </select>
            </form>
        </>
    );
}

export default SearchMoviesForm;