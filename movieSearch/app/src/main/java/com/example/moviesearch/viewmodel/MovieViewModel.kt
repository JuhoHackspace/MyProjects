package com.example.moviesearch.viewmodel

import android.util.Log
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.moviesearch.model.Movie
import com.example.moviesearch.model.MovieDetails
import com.example.moviesearch.model.MovieSearchResult
import com.example.moviesearch.model.TMDBApiService
import kotlinx.coroutines.launch

class MovieViewModel: ViewModel() {
    private val apiKey: String = "API_KEY"

    private val _movieList = MutableLiveData<List<Movie>>()
    val movieList: LiveData<List<Movie>> = _movieList

    private val _searchQuery = MutableLiveData<String>()
    val searchQuery: LiveData<String> = _searchQuery

    private val _isLoading = MutableLiveData<Boolean>()
    val isLoading: LiveData<Boolean> = _isLoading

    private val _expanded = MutableLiveData<Boolean>()
    val expanded: LiveData<Boolean> = _expanded

    private val _movieDetails = MutableLiveData<MovieDetails>()
    val movieDetails: LiveData<MovieDetails> = _movieDetails

    private val _currentPage = MutableLiveData<Int>().apply { value = 1 }
    val currentPage: LiveData<Int> = _currentPage

    private val _totalPages = MutableLiveData<Int>().apply { value = 1 }
    val totalPages: LiveData<Int> = _totalPages

    private val _errorMessage = MutableLiveData<String?>().apply { value = null }
    val errorMessage: LiveData<String?> = _errorMessage

    fun fetchMovieDetails(movieId: Int) {
        _isLoading.value = true
        _errorMessage.value = null
        viewModelScope.launch {
            var TMDBApi: TMDBApiService? = null
            try {
                TMDBApi = TMDBApiService.getInstance()
                _movieDetails.value = TMDBApi.getMovieDetails(movieId = movieId, apiKey = apiKey)
            } catch (e: Exception) {
                Log.d("MovieViewModel", "Error: ${e.message}")
                _errorMessage.value = "Error fetching movie details: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun searchMovies(query: String, page: Int = 1) {
        if (query.isBlank()) {
            _movieList.value = emptyList()
            return
        }
        query.trim()
        val queryString = query.replace(" ", "+")
        _isLoading.value = true
        _errorMessage.value = null
        viewModelScope.launch {
            var TMDBApi: TMDBApiService? = null
            try {
                TMDBApi = TMDBApiService.getInstance()
                clearMovies()
                val result: MovieSearchResult = TMDBApi.searchMovies( apiKey = apiKey, query = queryString, page = page)
                _totalPages.value = result.total_pages
                _movieList.value = result.results
            } catch (e: Exception) {
                Log.d("MovieViewModel", "Error: ${e.message}")
                _errorMessage.value = "Error searching movies: ${e.message}"
            } finally {
                _isLoading.value = false
            }
        }
    }

    fun clearMovies() {
        _movieList.value = emptyList()
    }

    fun updateSearchQuery(query: String) {
        _searchQuery.value = query
        _currentPage.value = 1
        searchMovies(query, _currentPage.value!!)
    }

    fun loadNextPage() {
        if (_currentPage.value!! < _totalPages.value!!) {
            _currentPage.value = _currentPage.value!! + 1
            searchQuery.value?.let { searchMovies(it, currentPage.value!!) }
        }
    }

    fun loadPreviousPage() {
        if (_currentPage.value!! > 1) {
            _currentPage.value = _currentPage.value!! - 1
            searchQuery.value?.let { searchMovies(it, currentPage.value!!) }
        }
    }

    fun setExpanded(expanded: Boolean) {
        _expanded.value = expanded
    }
}