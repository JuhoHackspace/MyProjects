package com.example.moviesearch.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.example.moviesearch.model.Movie
import com.example.moviesearch.viewmodel.MovieViewModel

@Composable
fun PaginationAndMovieList(
    movieList: List<Movie>,
    currentPage: Int,
    totalPages: Int,
    viewModel: MovieViewModel,
    navController: NavController
) {
    Column(modifier = Modifier.fillMaxSize()) {
        PaginationComponent(
            currentPage = currentPage,
            totalPages = totalPages,
            onPreviousPage = { viewModel.loadPreviousPage() },
            onNextPage = { viewModel.loadNextPage() },
            movieListEmpty = movieList.isEmpty()
        )
        MovieList(
            movies = movieList,
            navController = navController
        )
    }
}
