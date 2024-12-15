package com.example.moviesearch.ui

import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.res.stringResource
import androidx.navigation.NavController
import com.example.moviesearch.R
import com.example.moviesearch.viewmodel.MovieViewModel

@Composable
fun DetailsScreen(
    navController: NavController,
    viewModel: MovieViewModel,
    error: String?
) {
    Scaffold(
        topBar = { ScreenTopBar(stringResource(R.string.details), navController) },
        content = { paddingValues ->
            MovieDetailsContent(viewModel, paddingValues, error)
        }
    )
}