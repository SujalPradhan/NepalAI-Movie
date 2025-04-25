import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from api.models import Movie

class Command(BaseCommand):
    help = 'Scrapes movie poster images from IMDB and adds them to the database'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--movie_id',
            type=int,
            help='ID of a specific movie to scrape',
        )
        parser.add_argument(
            '--all',
            action='store_true',
            help='Scrape all movies without poster images',
        )

    def handle(self, *args, **options):
        if options['movie_id']:
            # Scrape a specific movie
            try:
                movie = Movie.objects.get(id=options['movie_id'])
                self.scrape_movie_poster(movie)
            except Movie.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Movie with ID {options['movie_id']} does not exist"))
        elif options['all']:
            # Scrape all movies that don't have a poster image
            movies = Movie.objects.filter(poster_image__isnull=True) | Movie.objects.filter(poster_image='')
            total = movies.count()
            
            if total == 0:
                self.stdout.write(self.style.SUCCESS("All movies already have poster images"))
                return
                
            self.stdout.write(f"Found {total} movies without poster images. Starting scraping...")
            
            for i, movie in enumerate(movies, 1):
                self.stdout.write(f"Processing movie {i}/{total}: {movie.title}")
                self.scrape_movie_poster(movie)
        else:
            self.stdout.write(self.style.ERROR("Please provide either --movie_id or --all option"))

    def scrape_movie_poster(self, movie):
        if not movie.imdb_url:
            self.stdout.write(self.style.WARNING(f"Movie '{movie.title}' has no IMDB URL"))
            return
        
        url = movie.imdb_url
        header = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
        }
        
        try:
            response = requests.get(url, headers=header)
            soup = BeautifulSoup(response.content, "html.parser")

            # Method 1: Find poster image by class
            poster_img = soup.find("img", class_="ipc-image")
            
            if poster_img:
                img_url = poster_img.get("src")
                movie.poster_image = img_url
                movie.save()
                self.stdout.write(self.style.SUCCESS(f"Successfully scraped poster for '{movie.title}'"))
                return
                
            # Method 2: Alternative approach
            poster_div = soup.find("div", class_="ipc-media ipc-media--poster-27x40")
            if poster_div:
                img_tag = poster_div.find("img")
                if img_tag:
                    img_url = img_tag.get("src")
                    movie.poster_image = img_url
                    movie.save()
                    self.stdout.write(self.style.SUCCESS(f"Successfully scraped poster for '{movie.title}'"))
                    return
                    
            # Method 3: Try to find any large poster image
            poster_img = soup.find("img", class_="fill")
            if poster_img:
                img_url = poster_img.get("src")
                movie.poster_image = img_url
                movie.save()
                self.stdout.write(self.style.SUCCESS(f"Successfully scraped poster for '{movie.title}'"))
                return
            
            self.stdout.write(self.style.WARNING(f"Could not find poster image for '{movie.title}'"))
            
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error scraping '{movie.title}': {str(e)}"))