from rest_framework.routers import DefaultRouter

from .views import (
    MovieViewSet,
    GenreViewSet,
    DirectorViewSet,
    ActorViewSet,
    ReviewViewSet,
)

router = DefaultRouter()

router.register("movies", MovieViewSet)
router.register("genres", GenreViewSet)
router.register("directors", DirectorViewSet)
router.register("actors", ActorViewSet)
router.register("reviews", ReviewViewSet)

urlpatterns = router.urls
