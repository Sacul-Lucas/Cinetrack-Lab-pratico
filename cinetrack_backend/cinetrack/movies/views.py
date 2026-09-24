from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets

from .filters import (
    MovieFilter,
    GenreFilter,
    DirectorFilter,
    ActorFilter,
    ReviewFilter,
)

from .models import Movie, Genre, Director, Actor, Review

from .serializers import (
    MovieSerializer,
    GenreSerializer,
    DirectorSerializer,
    ActorSerializer,
    ReviewSerializer,
)

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    
    filterset_class = MovieFilter
    
    search_fields = [
        "title",
        "synopsis",
        "director__name",
        "genres__name",
        "actors__name",
        "watched",
    ]
    
    ordering_fields = [
        "title",
        "release_date",
        "rating",
        "duration",
        "watched",
        "created_at",
    ]
    
    ordering = ["title"]


class GenreViewSet(viewsets.ModelViewSet):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = GenreFilter

    search_fields = [
        "name",
    ]

    ordering_fields = [
        "name",
    ]

    ordering = ["name"]


class DirectorViewSet(viewsets.ModelViewSet):
    queryset = Director.objects.all()
    serializer_class = DirectorSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = DirectorFilter

    search_fields = [
        "name",
        "nationality",
    ]

    ordering_fields = [
        "name",
        "birth_date",
    ]

    ordering = ["name"]


class ActorViewSet(viewsets.ModelViewSet):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = ActorFilter

    search_fields = [
        "name",
        "nationality",
    ]

    ordering_fields = [
        "name",
        "birth_date",
    ]

    ordering = ["name"]


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]

    filterset_class = ReviewFilter

    search_fields = [
        "comment",
        "movie__title",
        "user__username",
    ]

    ordering_fields = [
        "rating",
        "created_at",
    ]

    ordering = ["-created_at"]