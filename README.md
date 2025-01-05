# Letter Recognition App

A mobile application that recognizes handwritten letters using different machine learning approaches (CNN and PCA+CNN).

## Project Structure

- **backend/** - Django REST API server
- **facial-recognition/** - React Native mobile application

## Features

- Handwritten letter recognition using:
  - CNN model
  - PCA + CNN model (dimensionality reduction)
- Real-time drawing interface
- Camera capture support
- API endpoints for different recognition methods

## Getting Started

### Backend Setup

1. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

3. Run Django server:
```bash
python manage.py runserver
```

### Mobile App Setup

1. Install dependencies:
```bash
cd facial-recognition
npm install
```

2. Start the development server:
```bash
npx expo start
```

3. Build the app:
```bash
npx react-native build-android --mode=release
```

## API Endpoints

- `/api/hello/` - Test endpoint
- `/api/pca_letters/` - Letter recognition using PCA + CNN
- `/api/cnn_letters/` - Letter recognition using CNN only
- `/api/cnn_pca_letters/` - Alternative PCA + CNN endpoint

## Technologies Used

### Backend
- Django
- Django REST Framework
- TensorFlow
- NumPy
- Pillow
- scikit-learn

### Frontend
- React Native
- Expo
- TypeScript
- Lottie for animations

## License

[Your license here]