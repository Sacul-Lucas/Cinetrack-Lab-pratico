from django.contrib import admin
from .models import Movie, Genre, Director, Actor, Review

# Register your models here.

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "release_date",
        "duration",
        "rating",
        "director",
    )
    search_fields = ("title",)
    list_filter = ("release_date", "genres")


@admin.register(Genre)
class GenreAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


@admin.register(Director)
class DirectorAdmin(admin.ModelAdmin):
    list_display = ("name", "birth_date", "nationality")
    search_fields = ("name",)


@admin.register(Actor)
class ActorAdmin(admin.ModelAdmin):
    list_display = ("name", "birth_date", "nationality")
    search_fields = ("name",)


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("movie", "user", "rating", "created_at")
    list_filter = ("rating", "created_at")
