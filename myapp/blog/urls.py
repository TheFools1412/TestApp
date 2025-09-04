from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BlogViewSet

# tạo router
router = DefaultRouter()
router.register(r'blogs', BlogViewSet, basename='blog')

urlpatterns = [
    path('', include(router.urls)),
]
