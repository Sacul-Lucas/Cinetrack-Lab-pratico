import django_filters

from .models import Movie, Genre, Director, Actor, Review

class MovieFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(
    field_name="title",
    lookup_expr="icontains",
    )
    
    director = django_filters.CharFilter(
        field_name="director__name",
        lookup_expr="icontains",
    )
    
    genre = django_filters.CharFilter(
        field_name="genres__name",
        lookup_expr="icontains",
    )
    
    actor = django_filters.CharFilter(
        field_name="actors__name",
        lookup_expr="icontains",
    )
    
    year = django_filters.NumberFilter(
        field_name="release_date",
        lookup_expr="year",
    )
    
    min_rating = django_filters.NumberFilter(
        field_name="rating",
        lookup_expr="gte",
    )
    
    max_rating = django_filters.NumberFilter(
        field_name="rating",
        lookup_expr="lte",
    )
    
    min_duration = django_filters.NumberFilter(
        field_name="duration",
        lookup_expr="gte",
    )
    
    max_duration = django_filters.NumberFilter(
        field_name="duration",
        lookup_expr="lte",
    )

    watched = django_filters.BooleanFilter(
        field_name="watched",
    )

class Meta:
    model = Movie
    fields = [
        "title",
        "director",
        "genre",
        "actor",
        "year",
        "min_rating",
        "max_rating",
        "min_duration",
        "max_duration",
    ]


class GenreFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(
    field_name="name",
    lookup_expr="icontains",
    )

class Meta:
    model = Genre
    fields = [
        "name",
    ]


class DirectorFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(
    field_name="name",
    lookup_expr="icontains",
    )

    nationality = django_filters.CharFilter(
        field_name="nationality",
        lookup_expr="icontains",
    )

    birth_date = django_filters.DateFilter(
        field_name="birth_date",
    )

class Meta:
    model = Director
    fields = [
        "name",
        "nationality",
        "birth_date",
    ]


class ActorFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(
    field_name="name",
    lookup_expr="icontains",
    )

    nationality = django_filters.CharFilter(
        field_name="nationality",
        lookup_expr="icontains",
    )

    birth_date = django_filters.DateFilter(
        field_name="birth_date",
    )

class Meta:
    model = Actor
    fields = [
        "name",
        "nationality",
        "birth_date",
    ]


class ReviewFilter(django_filters.FilterSet):
    rating = django_filters.NumberFilter(
    field_name="rating",
    )

    min_rating = django_filters.NumberFilter(
        field_name="rating",
        lookup_expr="gte",
    )

    max_rating = django_filters.NumberFilter(
        field_name="rating",
        lookup_expr="lte",
    )

    movie = django_filters.NumberFilter(
        field_name="movie_id",
    )

    movie_title = django_filters.CharFilter(
        field_name="movie__title",
        lookup_expr="icontains",
    )

    username = django_filters.CharFilter(
        field_name="user__username",
        lookup_expr="icontains",
    )

class Meta:
    model = Review
    fields = [
        "rating",
        "min_rating",
        "max_rating",
        "movie",
        "movie_title",
        "username",
    ]