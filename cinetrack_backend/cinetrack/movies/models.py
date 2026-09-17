from django.db import models
from django.core.validators import MaxValueValidator, MinValueValidator

# Create your models here.

class Movie(models.Model):
    title = models.CharField(max_length=200)
    synopsis = models.TextField()
    release_date = models.DateField()
    duration = models.PositiveIntegerField(
        help_text="Duração em minutos"
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=1,
        default=0,
        validators=[
            MinValueValidator(0),
            MaxValueValidator(10),
        ]
    )
    poster_url = models.URLField(blank=True)

    director = models.ForeignKey(
        "Director",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="movies"
    )

    genres = models.ManyToManyField(
        "Genre",
        related_name="movies"
    )

    actors = models.ManyToManyField(
        "Actor",
        related_name="movies",
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Genre(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Director(models.Model):
    name = models.CharField(max_length=150)
    birth_date = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name

class Actor(models.Model):
    name = models.CharField(max_length=150)
    birth_date = models.DateField(null=True, blank=True)
    nationality = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.name

class Review(models.Model):
    movie = models.ForeignKey(
        Movie,
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    user = models.ForeignKey(
        "auth.User",
        on_delete=models.CASCADE,
        related_name="reviews"
    )

    rating = models.PositiveIntegerField(
        validators=[
            MinValueValidator(1),
            MaxValueValidator(5),
        ]
    )

    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["movie", "user"],
                name="unique_movie_review_per_user"
            )
        ]

    def __str__(self):
        return f"{self.user} - {self.movie}"


