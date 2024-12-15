package com.example.moviesearch.model

data class MovieSearchResult(
    val page: Int,
    val results: List<Movie>,
    val total_pages: Int
)
