from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from rest_framework import status
import joblib
import numpy as np
import os
from PIL import Image
from io import BytesIO
import base64
import tensorflow as tf
from rest_framework.parsers import MultiPartParser, FormParser

# Label mapping for EMNIST
EMNIST_LABELS = {
    0: 'A',
    1: 'B',
    2: 'C',
    3: 'D',
    4: 'E',
    5: 'F',
    6: 'G',
    7: 'H',
    8: 'I',
    9: 'J',
    10: 'K',
    11: 'L',
    12: 'M',
    13: 'N',
    14: 'O',
    15: 'P',
    16: 'Q',
    17: 'R',
    18: 'S',
    19: 'T',
    20: 'U',
    21: 'V',
    22: 'W',
    23: 'X',
    24: 'Y',
    25: 'Z'
}

try:
    pca_components_path = os.path.abspath("arrays_emnist.npz")
    loaded_pca_data = np.load(pca_components_path)
    principal_components = loaded_pca_data['principal_components']
    X_mean = loaded_pca_data['X_mean']
    X_std = loaded_pca_data['X_std']
except Exception as e:
    principal_components = None
    X_mean = None
    X_std = None
    print(f"Error loading PCA components: {e}")

try:
    cnn_pca_model_path = os.path.abspath("emnist_cnn_pca_model.keras")
    loaded_cnn_pca_model = tf.keras.models.load_model(cnn_pca_model_path)
except Exception as e:
    loaded_cnn_pca_model = None
    print(f"Error loading CNN PCA model: {e}")

class HelloWorldView(APIView):
    def get(self, request):
        return Response({"message": "Hello from Django!"})

@api_view(['POST'])
def pca_letters(request):
    try:
        if principal_components is None or loaded_cnn_pca_model is None:
            return Response({"error": "Models not loaded properly"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        base64_image = request.data.get('image')
        if not base64_image:
            return Response({"error": "No image data provided"}, status=status.HTTP_400_BAD_REQUEST)
            
        image_data = base64.b64decode(base64_image)
        image = Image.open(BytesIO(image_data))

        image = image.convert('L')
        image = image.resize((28, 28))
        image_array = np.array(image)
        image_flat = image_array.reshape(1, -1)

        Z = (image_flat - X_mean) / X_std
        image_reduced = np.dot(Z, principal_components)
        image_reduced_reshaped = image_reduced.reshape(1, 10, 10, 1)

        prediction = loaded_cnn_pca_model.predict(image_reduced_reshaped)
        predicted_label = np.argmax(prediction, axis=1)[0]
        predicted_character = EMNIST_LABELS.get(predicted_label, "Unknown")

        return Response({"message": f"{predicted_character}"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def cnn_letters(request):
    try:
        base64_image = request.data.get('image')
        if not base64_image:
            return Response({"error": "No image data provided"}, status=status.HTTP_400_BAD_REQUEST)

        image_data = base64.b64decode(base64_image)
        image = Image.open(BytesIO(image_data))

        loaded_model = tf.keras.models.load_model('emnist_cnn_model.keras')

        image = image.convert('L') # togrey
        image = image.resize((28, 28))
        image_array = np.array(image)

        prediction = loaded_model.predict(image_array.reshape(1, 28, 28, 1))
        predicted_label = np.argmax(prediction)
        predicted_character = EMNIST_LABELS.get(predicted_label, "Unknown")

        return Response({"message": f"{predicted_character}"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def cnn_pca_letters(request):
    try:
        if principal_components is None or loaded_cnn_pca_model is None:
            return Response({"error": "Models not loaded properly"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        base64_image = request.data.get('image')
        if not base64_image:
            return Response({"error": "No image data provided"}, status=status.HTTP_400_BAD_REQUEST)

        image_data = base64.b64decode(base64_image)
        image = Image.open(BytesIO(image_data))

        image = image.convert('L')
        image = image.resize((28, 28))

        image_array = np.array(image)

        image_flat = image_array.reshape(-1, 784)

        Z = (image_flat - X_mean) / X_std

        image_reduced = np.dot(Z, principal_components)

        image_reduced_reshaped = image_reduced.reshape(1, 10, 10, 1)

        prediction = loaded_cnn_pca_model.predict(image_reduced_reshaped)
        predicted_label = np.argmax(prediction, axis=1)[0]
        predicted_character = EMNIST_LABELS.get(predicted_label, "Unknown")

        return Response({"message": f"{predicted_character}"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@parser_classes([MultiPartParser, FormParser])
def predict(request):
    try:
        image_data = request.data.get('image')
        if not image_data:
            return Response({'error': 'No image data provided'}, status=400)
            
        
        return Response({'result': 'success'})
    except Exception as e:
        return Response({'error': str(e)}, status=500)