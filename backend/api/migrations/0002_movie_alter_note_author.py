# Generated by Django 5.2 on 2025-04-24 14:55

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Movie',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('imdb_url', models.URLField(max_length=255, unique=True)),
                ('title', models.CharField(max_length=255)),
                ('year', models.CharField(blank=True, max_length=4, null=True)),
                ('runtime', models.CharField(blank=True, max_length=20, null=True)),
                ('genre', models.CharField(max_length=100)),
                ('rating', models.FloatField(blank=True, null=True)),
                ('votes', models.FloatField(blank=True, null=True)),
                ('plot', models.TextField()),
                ('clean_title', models.CharField(max_length=255)),
                ('clean_plot', models.TextField()),
                ('clean_genre', models.CharField(max_length=100)),
                ('vote_weight', models.FloatField(blank=True, null=True)),
                ('vote_weight_norm', models.FloatField(blank=True, null=True)),
                ('rating_norm', models.FloatField(blank=True, null=True)),
                ('popularity_score', models.FloatField(blank=True, null=True)),
                ('content', models.TextField()),
            ],
        ),
        migrations.AlterField(
            model_name='note',
            name='author',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
