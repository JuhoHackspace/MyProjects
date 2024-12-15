package com.example.moviesearch.ui

import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.res.stringResource
import androidx.compose.ui.text.font.FontWeight.Companion.Bold
import androidx.compose.ui.unit.dp
import com.example.moviesearch.R

@Composable
fun InfoContent(paddingValues: PaddingValues) {
    Column(modifier = Modifier.padding(paddingValues)) {
        Image(
            painter = painterResource(id = R.drawable.k1svtq19),
            contentDescription = null,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            contentScale = ContentScale.Crop
        )
        Text(
            text = stringResource(R.string.info_1) +
                    stringResource(R.string.info_2),
            modifier = Modifier.padding(16.dp),
            fontWeight = Bold
        )
    }
}