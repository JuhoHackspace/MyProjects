import axios from 'axios';

/**
 * AddToFavourites component is used to add a movie or TV-show to the user's favourites.
 * @param movie_id The id of the movie or TV-show.
 * @param type The type of the movie or TV-show.
 * @param title The title of the movie or TV-show.
 * @param token The user's token.
 * @returns {String}
 */


const addToFavourites = async (movie_id, type, title, token) => {
  console.log('token: ', token, 'movie_id: ', movie_id, 'type', type)
  const request_body = {
    "movieId": movie_id,
    "type": type
  }
  try {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/favourites/private/add`,
                       request_body, {
                        withCredentials: true,
                        headers: {
                          'Authorization': `bearer ${token}`,
                          'Content-Type': 'application/json',}
                        });
    if (response.status === 200) {
      return `Kohde ${title} lisätty suosikkeihin`;
    }
  } catch (error) {
    console.error('Virhe tapahtui', error);
    if(error.response.status === 403) {
      return 'Kirjaudu sisään lisätäksesi suosikkeihin';
    } else if(error.response.status === 400) {
      return `Kohde ${title} on jo suosikeissa`;
    }
    return "Virhe tapahtui"
    
  }
}

export default addToFavourites;