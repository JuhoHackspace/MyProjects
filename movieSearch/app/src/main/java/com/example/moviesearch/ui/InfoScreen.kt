package com.example.moviesearch.ui

import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.navigation.NavController

@Composable
fun InfoScreen(navController: NavController) {
    Scaffold(
        topBar = { ScreenTopBar("App info", navController) },
        content = { paddingValues ->
            InfoContent(paddingValues)
        }
    )
}