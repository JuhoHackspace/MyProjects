package com.example.moviesearch.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.moviesearch.R
import com.example.moviesearch.model.Movie
import com.example.moviesearch.viewmodel.MovieViewModel

@Composable
fun MainContent(
    navController: NavController,
    paddingValues: PaddingValues,
    viewModel: MovieViewModel,
    isLoading: Boolean,
    error: String?
) {
    val searchQuery: String by viewModel.searchQuery.observeAsState("")
    val movieList: List<Movie> by viewModel.movieList.observeAsState(emptyList())
    val currentPage: Int by viewModel.currentPage.observeAsState(1)
    val totalPages: Int by viewModel.totalPages.observeAsState(1)

    Column(modifier = Modifier
        .fillMaxSize()
        .padding(paddingValues)) {

        SearchBar(value = searchQuery, onValueChange = { viewModel.updateSearchQuery(it)})

        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            when {
                isLoading -> {
                    CircularProgressIndicator(modifier = Modifier.padding(16.dp))
                }
                movieList.isEmpty() && searchQuery.isNotEmpty() && error == null-> {
                    Text(
                        text = stringResource(R.string.no_movies_found),
                        modifier = Modifier.padding(16.dp),
                        fontSize = 24.sp
                    )
                }
                movieList.isEmpty() && searchQuery.isEmpty() -> {
                    Text(
                        text = stringResource(R.string.search_for_movies),
                        modifier = Modifier.padding(16.dp),
                        fontSize = 24.sp
                    )
                }
                error != null -> {
                    Text(
                        text = error,
                        modifier = Modifier.padding(16.dp),
                        fontSize = 24.sp
                    )
                }
                else -> {
                    PaginationAndMovieList(
                        movieList = movieList,
                        currentPage = currentPage,
                        totalPages = totalPages,
                        viewModel = viewModel,
                        navController = navController
                    )
                }
            }
        }
    }
}