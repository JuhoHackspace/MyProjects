package com.example.moviesearch.ui

import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavController
import com.example.moviesearch.R
import com.example.moviesearch.viewmodel.MovieViewModel

@Composable
fun MainScreen(
    navController: NavController,
    viewModel: MovieViewModel,
    isLoading: Boolean,
    error: String?
) {
    Scaffold(
        topBar = {
            MainTopBar(stringResource(R.string.movie_search), navController, viewModel)
        },
        content = { paddingValues ->
            MainContent(navController, paddingValues, viewModel, isLoading, error)
        }
    )
}