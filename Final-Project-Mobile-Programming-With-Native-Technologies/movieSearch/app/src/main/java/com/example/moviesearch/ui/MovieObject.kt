package com.example.moviesearch.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import coil.compose.rememberAsyncImagePainter
import com.example.moviesearch.R
import com.example.moviesearch.model.Movie

@Composable
fun MovieObject(
    movie: Movie,
    onClick: () -> Unit = {}
) {
    Row(
        modifier = Modifier
            .padding(16.dp)
            .fillMaxWidth()
            .clickable(onClick = onClick),
    ){
        PosterImage(posterPath = movie.posterPath, modifier = Modifier.size(100.dp))
        Spacer(modifier = Modifier.width(16.dp))

        Column {
            Text(text = movie.title, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.tertiary)
            Text(text = movie.releaseDate?.split("-")?.get(0) ?: "Unknown")
        }
    }
}