# api/urls.py
from django.urls import path
from .views import HelloWorldView, pca_digits

urlpatterns = [
    path('hello/', HelloWorldView.as_view()),
    path('pca_digits/', pca_digits, name='pca_digits')
]
