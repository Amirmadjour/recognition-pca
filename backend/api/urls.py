# api/urls.py
from django.urls import path
from .views import HelloWorldView, pca_digits, cnn_digits, cnn_pca_digits

urlpatterns = [
    path('hello/', HelloWorldView.as_view()),
    path('pca_digits/', pca_digits, name='pca_digits'),
    path('cnn_digits/', cnn_digits, name='cnn_digits'),
    path('cnn_pca_digits/', cnn_pca_digits, name="cnn_pca_digits")
]
