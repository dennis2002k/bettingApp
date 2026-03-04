from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from bettingApp import views

router = DefaultRouter()
router.register(r"events", views.EventReadOnlyViewSet, basename="event")
router.register(r"users", views.UserViewSet, basename="user")
router.register(r"bets", views.BetViewSet, basename="bet")
router.register(r"markets", views.MarketViewSet, basename="market")

urlpatterns = [
    path("events/create/", views.CreateEventView.as_view()),
    path("", include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view()),       # login, returns access + refresh token
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path("api-auth/", include("rest_framework.urls")),
]
