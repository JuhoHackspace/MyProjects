package com.example.moviesearch.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.example.moviesearch.viewmodel.MovieViewModel

@Composable
fun MovieSearchApp(viewModel: MovieViewModel) {
    val navController = rememberNavController()
    val isLoading: Boolean by viewModel.isLoading.observeAsState(false)
    val error: String? by viewModel.errorMessage.observeAsState(null)

    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        composable("home") {
            MainScreen(navController, viewModel, isLoading, error)
        }
        composable("info") {
            InfoScreen(navController)
        }
        composable("details/{movieId}") { backStackEntry ->
            val movieId = backStackEntry.arguments?.getString("movieId")?.toInt() ?: return@composable
            viewModel.fetchMovieDetails(movieId)
            DetailsScreen(navController, viewModel, error)
        }
    }
}