package com.example.moviesearch.model

import retrofit2.http.GET
import retrofit2.http.Query
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Path

const val BASE_URL = "https://api.themoviedb.org/3/"

interface TMDBApiService {
    @GET("search/movie")
    suspend fun searchMovies(
        @Query("api_key") apiKey: String,
        @Query("query") query: String,
        @Query("page") page: Int = 1
    ): MovieSearchResult

    @GET("movie/{movie_id}")
    suspend fun getMovieDetails(
        @Path("movie_id") movieId: Int,
        @Query("api_key") apiKey: String
    ): MovieDetails

    companion object  {

        var TMDBService: TMDBApiService? = null

        fun getInstance(): TMDBApiService {
            if (TMDBService == null) {
                TMDBService = Retrofit.Builder()
                    .baseUrl(BASE_URL)
                    .addConverterFactory(GsonConverterFactory.create())
                    .build().create(TMDBApiService::class.java)
            }
            return TMDBService!!
        }
    }
}
