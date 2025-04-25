from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Note(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title


class Movie(models.Model):
    imdb_url = models.URLField(max_length=255, unique=True)
    title = models.CharField(max_length=255)
    year = models.CharField(max_length=4, null=True, blank=True)  # Some entries might be empty
    runtime = models.CharField(max_length=20, null=True, blank=True)
    genre = models.CharField(max_length=100)
    rating = models.FloatField(null=True, blank=True)
    votes = models.FloatField(null=True, blank=True)
    plot = models.TextField()
    clean_title = models.CharField(max_length=255)
    clean_plot = models.TextField()
    clean_genre = models.CharField(max_length=100)
    vote_weight = models.FloatField(null=True, blank=True)
    vote_weight_norm = models.FloatField(null=True, blank=True)
    rating_norm = models.FloatField(null=True, blank=True)
    popularity_score = models.FloatField(null=True, blank=True)
    content = models.TextField()
    poster_image = models.URLField(max_length=500, null=True, blank=True)
    poster_viewer = models.URLField(max_length=255, null=True, blank=True)

    def __str__(self):
        return self.title


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    favorite_genre1 = models.CharField(max_length=100, blank=True)
    favorite_movie1 = models.ForeignKey(Movie, on_delete=models.SET_NULL, null=True, blank=True, related_name='favorite_as_first')
 
    def __str__(self):
        return f"{self.user.username}'s profile"


