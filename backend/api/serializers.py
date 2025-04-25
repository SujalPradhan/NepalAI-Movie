from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note, Movie, UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['favorite_genre1', 'favorite_movie1']

class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(required=False)
    favorite_movie_id = serializers.IntegerField(write_only=True, required=False)
    favorite_genre = serializers.CharField(write_only=True, required=False)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'profile', 'favorite_genre', 'favorite_movie_id']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Extract profile data
        favorite_genre = validated_data.pop('favorite_genre', '')
        favorite_movie_id = validated_data.pop('favorite_movie_id', None)
        
        # Create user
        user = User.objects.create_user(**validated_data)
        
        # Create profile with favorite genre and movie
        profile_data = {
            'favorite_genre1': favorite_genre,
        }
        
        if favorite_movie_id:
            profile_data['favorite_movie1_id'] = favorite_movie_id
            
        UserProfile.objects.create(user=user, **profile_data)
        
        return user

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'created_at', 'author']
        extra_kwargs = {'author': {'read_only': True}}


class MovieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Movie
        fields = '__all__'