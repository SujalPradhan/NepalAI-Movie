from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer, NoteSerializer, MovieSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note, Movie
from django.db.models import Q
from google.generativeai import GenerativeModel
import google.generativeai as genai
import os
import json
# Create your views here.
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            # Save the note with the current user as the author
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.RetrieveDestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """
    Get current user information
    """
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

class MovieList(generics.ListAPIView):
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]
    queryset = Movie.objects.all()
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'clean_title', 'plot', 'clean_plot', 'genre', 'clean_genre']
    ordering_fields = ['title', 'year', 'rating', 'votes', 'popularity_score']
    ordering = ['-popularity_score']  # Default ordering

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def search_movies(request):
    """
    Search movies by title, plot, or genre
    """
    query = request.query_params.get('q', '')
    genre = request.query_params.get('genre', '')
    limit = int(request.query_params.get('limit', 20))
    
    movies = Movie.objects.all()

    if query:
        movies = movies.filter(
            Q(clean_title__icontains=query) | 
            Q(clean_plot__icontains=query)
        )
    
    if genre:
        movies = movies.filter(clean_genre__icontains=genre)
    
    # Order by popularity score
    movies = movies.order_by('-popularity_score')[:limit]
    
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_popular_movies(request):
    """
    Get popular movies
    """
    limit = int(request.query_params.get('limit', 10))
    movies = Movie.objects.all().order_by('-popularity_score')[:limit]
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_movie_genres(request):
    """
    Get all unique movie genres
    """
    # This is a simple approach - in a real application, you might want to normalize genres
    all_genres = Movie.objects.values_list('clean_genre', flat=True).distinct()
    
    # Process genres into a list
    genre_list = []
    for genre_string in all_genres:
        genres = genre_string.split()
        for genre in genres:
            if genre not in genre_list:
                genre_list.append(genre)
    
    return Response(sorted(genre_list))

@api_view(['GET'])
@permission_classes([AllowAny])
def get_register_options(request):
    """
    Get options for registration form (genres and popular movies)
    """
    # Get all unique genres
    all_genres = Movie.objects.values_list('clean_genre', flat=True).distinct()
    
    # Process genres into a list
    genre_list = []
    for genre_string in all_genres:
        genres = genre_string.split()
        for genre in genres:
            if genre not in genre_list:
                genre_list.append(genre)
    
    # Get popular movies for selection
    popular_movies = Movie.objects.all().order_by('-popularity_score')[:20]
    
    # Serialize the data
    movie_serializer = MovieSerializer(popular_movies, many=True)
    
    # Return both genres and popular movies
    return Response({
        'genres': sorted(genre_list),
        'popular_movies': movie_serializer.data
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def search_for_registration(request):
    """
    Search for genres and movies for registration form
    """
    query = request.query_params.get('q', '')
    search_type = request.query_params.get('type', 'all')  # 'genre', 'movie', or 'all'
    
    if not query:
        return Response({'message': 'Query parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
    
    results = {}
    
    # Search for genres if type is 'genre' or 'all'
    if search_type in ['genre', 'all']:
        all_genres = Movie.objects.values_list('clean_genre', flat=True).distinct()
        genre_list = []
        for genre_string in all_genres:
            genres = genre_string.split()
            for genre in genres:
                if genre not in genre_list:
                    genre_list.append(genre)
        
        # Filter genres that match the query
        matching_genres = [genre for genre in genre_list if query.lower() in genre.lower()]
        results['genres'] = matching_genres[:10]  # Limit to 10 results
    
    # Search for movies if type is 'movie' or 'all'
    if search_type in ['movie', 'all']:
        matching_movies = Movie.objects.filter(
            Q(title__icontains=query) | 
            Q(clean_title__icontains=query)
        ).order_by('-popularity_score')[:10]  # Limit to 10 results
        
        results['movies'] = MovieSerializer(matching_movies, many=True).data
    
    return Response(results)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_movie_posters(request):
    """
    Get movie poster images
    """
    movie_id = request.query_params.get('id')
    
    if movie_id:
        # Return poster for a specific movie
        try:
            movie = Movie.objects.get(id=movie_id)
            return Response({
                'id': movie.id,
                'title': movie.title,
                'poster_image': movie.poster_image,
                'poster_viewer': movie.poster_viewer
            })
        except Movie.DoesNotExist:
            return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Return posters for all movies
        movies = Movie.objects.exclude(poster_image__isnull=True).exclude(poster_image='')
        poster_data = [
            {
                'id': movie.id,
                'title': movie.title,
                'poster_image': movie.poster_image,
                'poster_viewer': movie.poster_viewer
            }
            for movie in movies
        ]
        return Response(poster_data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_movie_detail(request, movie_id):
    """
    Get detailed information about a specific movie, including poster images
    """
    try:
        movie = Movie.objects.get(id=movie_id)
        serializer = MovieSerializer(movie)
        data = serializer.data
        
        # Add a direct link to related movies (same genre)
        related_movies = Movie.objects.filter(
            Q(clean_genre__icontains=movie.clean_genre) & ~Q(id=movie.id)
        ).order_by('-popularity_score')[:5]
        
        related_data = []
        for related in related_movies:
            related_data.append({
                'id': related.id,
                'title': related.title,
                'year': related.year,
                'poster_image': related.poster_image
            })
        
        data['related_movies'] = related_data
        
        return Response(data)
    except Movie.DoesNotExist:
        return Response({'error': 'Movie not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def search_movies_with_gemini(request):
    """
    Search movies using natural language understanding with Google's Gemini API
    """
    # Get query from request data
    user_query = request.data.get('query', '')
    
    if not user_query:
        return Response({'error': 'Please provide a search query'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Get API key from environment variable
    api_key = os.environ.get('GEMINI_API_KEY')
    
    if not api_key:
        return Response({'error': 'Gemini API key not configured'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
    
    # For debugging - print to console
    print(f"Processing query: {user_query}")
    print(f"API Key available: {'Yes' if api_key else 'No'}")
    
    try:
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        
        # Initialize the Gemini model - simpler approach
        model = GenerativeModel('gemini-2.0-flash')
        
        # Simplified prompt - just ask for search terms
        prompt = f"""
        Based on this movie search query: "{user_query}"
        
        Extract 1-5 key search terms that would be useful for finding relevant movies.
        Return ONLY a comma-separated list of search terms.
        """
        
        print("Sending request to Gemini API...")
        response = model.generate_content(prompt)
        print(f"Received response: {response.text}")
        
        # Extract search terms from response
        search_terms = [term.strip() for term in response.text.strip().split(',')]
        print(f"Extracted search terms: {search_terms}")
        
        # Simple query - match any term in title, plot or genre
        query_obj = Q()
        for term in search_terms:
            if term:
                query_obj |= Q(clean_title__icontains=term) 
                query_obj |= Q(clean_plot__icontains=term)
                query_obj |= Q(clean_genre__icontains=term)
        
        # Execute the query
        movies = Movie.objects.filter(query_obj).order_by('-popularity_score')[:10]
        print(f"Found {len(movies)} matching movies")
        
        # If no movies found, fall back to regular search
        if not movies:
            print("No movies found, using fallback search")
            return fallback_search(user_query)
        
        # Serialize and return the movies
        serializer = MovieSerializer(movies, many=True)
        
        # Simple response - just return the movies
        return Response({
            'movies': serializer.data,
            'explanation': f"Search results for: {user_query}",
            'search_terms': search_terms
        })
            
    except Exception as e:
        print(f"Error in Gemini search: {str(e)}")
        # If there's any error with Gemini, fall back to regular search
        return fallback_search(user_query)
    

def fallback_search(query):
    """Helper function for falling back to regular search if Gemini fails"""
    movies = Movie.objects.filter(
        Q(clean_title__icontains=query) | 
        Q(clean_plot__icontains=query) |
        Q(clean_genre__icontains=query)
    ).order_by('-popularity_score')[:10]
    
    serializer = MovieSerializer(movies, many=True)
    return Response({
        'movies': serializer.data,
        'note': 'Results from regular search as AI search was unavailable'
    })