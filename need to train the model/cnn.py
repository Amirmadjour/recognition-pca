import numpy as np
import pandas as pd
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
import joblib

# 1. Chargement des données
train_df = pd.read_csv('../emnist/emnist-letters-train.csv', header=None)
test_df = pd.read_csv('../emnist/emnist-letters-test.csv', header=None)

# 2. Préparation des données
y_train = train_df.iloc[:, 0].values - 1
x_train = train_df.iloc[:, 1:].values
y_test = test_df.iloc[:, 0].values - 1
x_test = test_df.iloc[:, 1:].values

# 3. Normalisation avec StandardScaler
scaler = StandardScaler()
x_train = scaler.fit_transform(x_train)
x_test = scaler.transform(x_test)

# 4. Création et entraînement du modèle KNN
knn = KNeighborsClassifier(n_neighbors=5, n_jobs=-1)
knn.fit(x_train, y_train)

# 5. Évaluation sur le jeu de test
test_accuracy = knn.score(x_test, y_test)
print(f"Test accuracy: {test_accuracy:.4f}")

# 6. Sauvegarde du modèle
joblib.dump(knn, 'emnist_knn_model.pkl') 