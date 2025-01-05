# api/urls.py
from django.urls import path
from .views import HelloWorldView, pca_letters, cnn_letters, cnn_pca_letters

urlpatterns = [
    path('hello/', HelloWorldView.as_view()),
    path('pca_letters/', pca_letters, name='pca_letters'),
    path('cnn_letters/', cnn_letters, name='cnn_letters'),
    path('cnn_pca_letters/', cnn_pca_letters, name="cnn_pca_letters")
]
