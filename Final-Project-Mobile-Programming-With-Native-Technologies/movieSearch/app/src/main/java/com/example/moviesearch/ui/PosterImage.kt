package com.example.moviesearch.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import coil.compose.rememberAsyncImagePainter
import com.example.moviesearch.R

@Composable
fun PosterImage(
    posterPath: String?,
    modifier: Modifier = Modifier
) {
    val posterBaseURl = stringResource(R.string.poster_base_url)

    Box(
        modifier = modifier
    ) {
        if (posterPath != null) {
            Image(
                painter = rememberAsyncImagePainter("${posterBaseURl}${posterPath}"),
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        } else {
            Image(
                painter = painterResource(id = R.drawable.ic_launcher_foreground),
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }
    }
}