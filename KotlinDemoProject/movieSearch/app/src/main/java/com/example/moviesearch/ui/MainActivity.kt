package com.example.moviesearch.ui


import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.runtime.Composable
import androidx.compose.ui.tooling.preview.Preview
import com.example.moviesearch.ui.theme.CustomTheme
import com.example.moviesearch.viewmodel.MovieViewModel

class MainActivity : ComponentActivity() {
    private val viewModel: MovieViewModel by viewModels()
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            CustomTheme {
                MovieSearchApp(viewModel)
            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun MainPreview() {
    CustomTheme {
       //MovieSearchApp()
    }
}