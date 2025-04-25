import csv
import os
import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from api.models import Movie

class Command(BaseCommand):
    help = 'Import movies from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('csv_file', type=str, help='Path to the CSV file')
        parser.add_argument('--fetch-posters', action='store_true', help='Fetch poster images from IMDB')

    def handle(self, *args, **options):
        csv_file = options['csv_file']
        fetch_posters = options.get('fetch_posters', False)
        
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'File does not exist: {csv_file}'))
            return
        
        with open(csv_file, 'r', encoding='utf-8') as f:
            reader = csv.reader(f)
            next(reader)  # Skip header row
            
            # Clear existing movies
            Movie.objects.all().delete()
            
            counter = 0
            for row in reader:
                # Skip empty rows
                if not row:
                    continue
                
                try:
                    # Extract data from CSV row
                    imdb_url = row[0]
                    title = row[1]
                    year = row[2] if row[2] else None
                    runtime = row[3] if row[3] else None
                    genre = row[4].strip('"')  # Remove quotes
                    rating = float(row[5]) if row[5] else None
                    votes = float(row[6]) if row[6] else None
                    plot = row[7]
                    clean_title = row[8]
                    clean_plot = row[9]
                    clean_genre = row[10]
                    vote_weight = float(row[11]) if row[11] else None
                    vote_weight_norm = float(row[12]) if row[12] else None
                    rating_norm = float(row[13]) if row[13] else None
                    popularity_score = float(row[14]) if row[14] else None
                    content = row[15] if len(row) > 15 else ""
                    
                    # Initialize poster fields
                    poster_image = None
                    poster_viewer = None
                    
                    # Fetch poster image if requested
                    if fetch_posters and imdb_url:
                        try:
                            # Extract IMDB ID from URL
                            imdb_id = imdb_url.strip('/').split('/')[-1]
                            poster_viewer_url = f"https://www.imdb.com/title/{imdb_id}/mediaviewer/"
                            
                            # Fetch the IMDB page
                            response = requests.get(imdb_url)
                            if response.status_code == 200:
                                soup = BeautifulSoup(response.text, 'html.parser')
                                
                                # Find the poster image URL (using og:image meta tag)
                                og_image = soup.find("meta", property="og:image")
                                poster_img_url = og_image["content"] if og_image else None
                                
                                if poster_img_url:
                                    poster_image = poster_img_url
                                    poster_viewer = poster_viewer_url
                                    self.stdout.write(f"Found poster for {title}")
                                else:
                                    self.stdout.write(f"No poster found for {title}")
                            else:
                                self.stdout.write(f"Failed to fetch IMDB page for {title}")
                        except Exception as e:
                            self.stdout.write(f"Error fetching poster for {title}: {e}")
                    
                    # Create movie object
                    Movie.objects.create(
                        imdb_url=imdb_url,
                        title=title,
                        year=year,
                        runtime=runtime,
                        genre=genre,
                        rating=rating,
                        votes=votes,
                        plot=plot,
                        clean_title=clean_title,
                        clean_plot=clean_plot,
                        clean_genre=clean_genre,
                        vote_weight=vote_weight,
                        vote_weight_norm=vote_weight_norm,
                        rating_norm=rating_norm,
                        popularity_score=popularity_score,
                        content=content,
                        poster_image=poster_image,
                        poster_viewer=poster_viewer
                    )
                    counter += 1
                    
                except Exception as e:
                    self.stdout.write(self.style.ERROR(f'Error importing row: {e}'))
                    continue
            
            self.stdout.write(self.style.SUCCESS(f'Successfully imported {counter} movies'))