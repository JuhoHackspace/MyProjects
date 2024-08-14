import React, {useEffect} from 'react';
import {useState} from 'react';
import axios from 'axios';
import styles from '@pages/css/Movies.module.css';
import '../index.css';
import SearchMoviesForm from "@content/Movies/SearchMoviesForm.jsx";
import SearchResult from "@content/SearchResult.jsx";
import PaginatorNavigateMenu from "@content/Movies/PaginatorNavigateMenu.jsx";
import Notice from "@content/Notice.jsx";
import addToFavourites from "@content/AddFavourites.js";
import {useLoginData} from "../context/useLoginData";
import {useNavigate} from "react-router-dom";
import {useRef} from 'react';
import PostMovieOrTvShowToGroup from "@content/PostMovieOrTvShowToGroup.jsx";
import postMovieOrTvShowToGroup from "@content/PostMovieOrTvShowToGroup.jsx";

/**
 * Movies component for showing the movies page.
 * @param language The language of the movies.
 * @returns {Element}
 */


const Movies = ({language}) => {

    // queryString and setQueryString are passed further down to SearchMoviesForm.jsx
    const [queryString, setQueryString] = useState('');
    const [year, setYear] = useState('');
    // genre and setGenre are passed further down to SearchMoviesForm.jsx
    const [genre, setGenre] = useState("");
    const [disableGenres, setDisableGenres] = useState(false);
    const [searchData, setSearchData] = useState([]);
    const [genreNum, setGenreNum] = useState(0);
    const [page, setPage] = useState(1);
    const [disableYear, setDisableYear] = useState(false);
    const [searchMoviesOrTV, setSearchMoviesOrTV] = useState("Elokuvia");
    const [notice, setNotice] = useState({message: '', show: false})
    const [showChooseGroupDialog, setShowChooseGroupDialog] = useState(false); // For add movie to group
    const [groupChosen, setGroupChosen] = useState(false); // For add movie to group
    const loginData = useLoginData();
    const ref = useRef(null)

    const addFavourites = async (id, type, name) => {
        if (!loginData.token) {
            setNotice({message: "Kirjaudu sisään lisätäksesi suosikkeihin", show: true});
        } else {
            setNotice({message: await addToFavourites(id, type, name, loginData.token), show: true});
        }
    }

    const addMovieOrTvToGroup = (id, type, name) => {
        setTitleAndTypeAndId({title: name, id: id, type: type});
        setShowGroupSelector(true);
    }


    const getEndpoint = (ep) => {
        const genreNumOrName = ep === 'TV' ? genreNum : genre;
        const q = queryString ? `&query=${queryString}` : '';
        const g = genre ? `&genre=${genreNumOrName}` : '';
        const p = page ? `&page=${page}` : '';
        const y = year ? `&year=${year}` : '';
        const l = language ? `&language=${language}` : 'fi';
        let url = '';
        switch (ep) {
            case 'TV':
                url = `${import.meta.env.VITE_BACKEND_URL}/tv/search?${q}${g}${p}${y}${l}`;
                break;
            case 'Elokuvia':
                url = `${import.meta.env.VITE_BACKEND_URL}/movie/search?${q}${g}${p}${y}${l}`;
                break;
            default:
                throw new Error('ep must be either "TV" or "Elokuvia"');
        }
        return url;
    }

    /**
     * @param ep Must be either "TV" or "Movies"
     * @returns {Promise<any>}
     */
    const search = async (ep) => {
        const url = getEndpoint(ep);
        let response = await axios.get(url);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Error fetching data');
        }
    }
    const navigate = useNavigate()
    const addReview = (type, id, title) => {
        navigate(`/review/${type}/${id}/${title}`)
    }

    useEffect(() => {
            setSearchData([]);
            setDisableGenres(queryString);
            setDisableYear(searchMoviesOrTV === "TV");

            search(searchMoviesOrTV).then(response => {
                console.log(response.results);
                setSearchData(response.results.map((item, index) => {
                    return (
                        <SearchResult image={item.poster_path}
                                      title={searchMoviesOrTV === "Elokuvia" ? item.title : item.name}
                                      description={item.overview}
                                      published={item.release_date}
                                      tmdb_score={item.vote_average}
                                      type={searchMoviesOrTV === "Elokuvia" ? "movie" : "tv"}
                                      id={item.id}
                                      handleAddFavourites={addFavourites}
                                      handleAddReview={addReview}
                                      handleAddToGroup={addMovieOrTvToGroup}
                                      groupId={null}

                                      key={searchMoviesOrTV === "Elokuvia" ? item.title : item.name}/>
                    );
                }));
            }).catch(error => {
                console.error(error, searchMoviesOrTV);
            });
        }, [queryString, genre, year, searchMoviesOrTV, page]
    );

    const handleGroupChosen = (group) => {
        setShowChooseGroupDialog(false);
        setGroupChosen(group);
        // TODO: Call the backend to add the movie to the group
    }

    const [showGroupSelector, setShowGroupSelector] = useState(false)
    const [titleAndTypeAndId, setTitleAndTypeAndId] = useState({title: '', id: 0, type: ''})

    return (
        <>
            {showGroupSelector && <PostMovieOrTvShowToGroup
                                        title={titleAndTypeAndId.title}
                                        id={titleAndTypeAndId.id}
                                        type={titleAndTypeAndId.type}
                                        setVisible={setShowGroupSelector}
            />
                }
            {notice.show && <Notice ref={ref} noticeHeader="Ilmoitus" noticeText={notice.message}
                                    position={{left: '50%', top: '35%', transform: 'translate(-50%, -50%)'}}
                                    showSeconds={3} setNotice={setNotice}/>}
            {showChooseGroupDialog && <ChooseGroup onGroupChosen={handleGroupChosen} />}
            <SearchMoviesForm
                queryString={queryString} setQueryString={setQueryString}
                genre={genre} setGenre={setGenre} disableGenres={disableGenres}
                genreNum={genreNum} setGenreNum={setGenreNum}
                year={year} setYear={setYear} disableYear={disableYear}
                moviesOrTV={searchMoviesOrTV} setMoviesOrTV={setSearchMoviesOrTV}
            />
            <div className={styles.searchResults}>
                <PaginatorNavigateMenu currentPage={page} totalPages={10} onPageChange={setPage}/>
                {searchData}
                {searchData && <PaginatorNavigateMenu currentPage={page} totalPages={10} onPageChange={setPage}/>}
            </div>

        </>
    );
};

export default Movies;
