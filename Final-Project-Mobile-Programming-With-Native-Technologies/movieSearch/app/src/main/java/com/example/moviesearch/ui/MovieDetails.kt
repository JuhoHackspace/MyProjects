package com.example.moviesearch.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.rememberAsyncImagePainter
import com.example.moviesearch.R
import com.example.moviesearch.model.MovieDetails

@Composable
fun MovieDetails(
    details: MovieDetails,
    paddingValues: PaddingValues
) {
    Column(modifier = Modifier.padding(paddingValues)) {
        PosterImage(
            posterPath = details.posterPath,
            modifier = Modifier
                .fillMaxWidth()
                .height(300.dp)
                .padding(16.dp)
        )
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = details.title,
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(16.dp))
        Text(
            text = "Release Date: ${details.releaseDate}",
            modifier = Modifier.padding(16.dp))
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = details.overview,
            modifier = Modifier.padding(16.dp))
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = "Genres: ${details.genres.joinToString { it.name }}",
            modifier = Modifier.padding(16.dp))
    }
}