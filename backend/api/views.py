from django.shortcuts import render

# Create your views here.
# api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
import joblib
import numpy as np
import os
from PIL import Image
from io import BytesIO
import base64
import tensorflow as tf
import matplotlib.pyplot as plt

class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message": "Hello from Django!"})

@api_view(['POST'])
def pca_digits(request):
    try:

        pca_model_path = os.path.abspath("pca_model.pkl")
        knn_model_path = os.path.abspath("knn_model.pkl")
        print("PCA model path:", pca_model_path)
        print("KNN model path:", knn_model_path)

        loaded_pca = joblib.load("pca_model.pkl")
        loaded_knn = joblib.load("knn_model.pkl")

        base64_image = request.data.get('image')


        image_data = base64.b64decode(base64_image)  # Remove the data URL part
        print(image_data)
        image = Image.open(BytesIO(image_data))


        # Resize the image to 28x28 pixels (grayscale)
        image = image.convert('L')  # Convert to grayscale
        image = image.resize((28, 28))

        # Convert image to numpy array (flatten it)
        image_array = np.array(image)

        def plot_images(original ):
            plt.figure(figsize=(10, 4))
            # Original
            plt.imshow(original.reshape(28, 28), cmap='gray')
            plt.title("Original")
            plt.axis('off')

            plt.tight_layout()
            plt.show()

        # plot_images(image_array)

        image_flat = image_array.reshape(1, -1)  

        image_standardized = image_flat / 255.0 

        image_pca = loaded_pca.transform(image_standardized)

        predicted_label = loaded_knn.predict(image_pca)
        print(f"Predicted Label for New Image: {predicted_label[0]}")

        # image_reconstructed = loaded_pca.inverse_transform(image_pca)

        print(image_pca)
        # plot_images(image_reconstructed)

        return Response({"message": f"{predicted_label[0]}"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def cnn_digits(request):
    try:
        base64_image = request.data.get('image')


        image_data = base64.b64decode(base64_image)  # Remove the data URL part
        image = Image.open(BytesIO(image_data))

        loaded_model = tf.keras.models.load_model('mnist_cnn_model.keras')

        # Resize the image to 28x28 pixels (grayscale)
        image = image.convert('L')  # Convert to grayscale
        image = image.resize((28, 28))
        image_array = np.array(image)

        predicted_label = np.argmax(loaded_model.predict(image_array.reshape(1, 28, 28, 1)))

        return Response({"message": f"{predicted_label}"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def cnn_pca_digits(request):
    try:
        base64_image = request.data.get('image')


        image_data = base64.b64decode(base64_image)  # Remove the data URL part
        image = Image.open(BytesIO(image_data))

        loaded_model = tf.keras.models.load_model('mnist_cnn_pca_model.keras')

        # Resize the image to 28x28 pixels (grayscale)
        image = image.convert('L')  # Convert to grayscale
        image = image.resize((28, 28))


        image_array = np.array(image)

        def plot_images(original):
            plt.figure(figsize=(10, 4))
            # Original
            plt.imshow(original.reshape(28, 28), cmap='gray')
            plt.title("CNN with pca")
            plt.axis('off')

            plt.tight_layout()
            plt.show()


        image_array = image_array.reshape(-1, 784)

        loaded = np.load("arrays.npz")
        Z = (image_array - loaded['X_mean']) / loaded['X_std']
        image_reduced = np.real(np.dot(Z, loaded['principal_components']))

        def reconstruct(X, principal_components):
          X_reconstructed = 0
          for i in range(principal_components.shape[1]):
            X_reconstructed += X[:, i].reshape(-1, 1).dot(principal_components[:, i].reshape(-1, 1).T)

          return X_reconstructed
        
        image_reconstructed = reconstruct(image_reduced, loaded['principal_components'])
        print(image_reconstructed.shape)
        #plot_images(image_reconstructed)

        predicted_label = np.argmax(loaded_model.predict(image_reconstructed.reshape(1, 28, 28, 1)))

        return Response({"message": f"{predicted_label}"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)