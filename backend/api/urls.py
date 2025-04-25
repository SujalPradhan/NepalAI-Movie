from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note_list_create"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="note_delete"),
    path("user/register/", views.CreateUserView.as_view(), name="user_register"),
    path("user/info/", views.get_user_info, name="user_info"),
    path("movies/", views.MovieList.as_view(), name="movie_list"),
    path("movies/search/", views.search_movies, name="search_movies"),
    path("movies/popular/", views.get_popular_movies, name="popular_movies"),
    path("movies/genres/", views.get_movie_genres, name="movie_genres"),
    path("register/options/", views.get_register_options, name="register_options"),
    path("register/search/", views.search_for_registration, name="register_search"),
    path("movies/posters/", views.get_movie_posters, name="movie_posters"),
    path("movies/detail/<int:movie_id>/", views.get_movie_detail, name="movie_detail"),
    path("movies/ai-search/", views.search_movies_with_gemini, name="ai_search_movies"),
]