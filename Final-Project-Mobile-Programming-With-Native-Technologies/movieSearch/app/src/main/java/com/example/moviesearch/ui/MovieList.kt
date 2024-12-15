package com.example.moviesearch.ui

import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.example.moviesearch.model.Movie
import com.example.moviesearch.viewmodel.MovieViewModel

@Composable
fun MovieList(
    movies: List<Movie>,
    navController: NavController
) {
    LazyColumn(modifier = Modifier.fillMaxSize()) {
        items(movies.size) { index ->
            MovieObject(movies[index], onClick = {
                navController.navigate("details/${movies[index].id}")
            })
        }
    }
}