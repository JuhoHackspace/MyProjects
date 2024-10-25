package com.example.moviesearch.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.livedata.observeAsState
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.res.stringResource
import com.example.moviesearch.R
import com.example.moviesearch.viewmodel.MovieViewModel

@Composable
fun MovieDetailsContent(
    viewModel: MovieViewModel,
    paddingValues: PaddingValues,
    error: String?
) {
    val movieDetails by viewModel.movieDetails.observeAsState()
    val isLoading by viewModel.isLoading.observeAsState(false)
    when {
        isLoading -> {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator()
            }
        }
        error != null -> {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(text = error)
            }
        }
        else -> {
            movieDetails?.let { details ->
                MovieDetails(details = details, paddingValues = paddingValues)
            }
        }
    }
}