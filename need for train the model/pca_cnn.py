import tensorflow as tf
import numpy as np
from sklearn.decomposition import PCA
import pandas as pd

# 1. Chargement des données
train_df = pd.read_csv('../emnist/emnist-letters-train.csv', header=None)
test_df = pd.read_csv('../emnist/emnist-letters-test.csv', header=None)

# 2. Préparation des données
y_train = train_df.iloc[:, 0].values - 1
x_train = train_df.iloc[:, 1:].values
y_test = test_df.iloc[:, 0].values - 1
x_test = test_df.iloc[:, 1:].values

# 3. Normalisation
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0

# 4. Standardisation
X_mean = x_train.mean(axis=0)
X_std = x_train.std(axis=0)
X_std = np.where(X_std == 0, 1, X_std)  # Éviter division par zéro
X_train_standardized = (x_train - X_mean) / X_std

# 5. PCA
n_components = 100
pca = PCA(n_components=n_components)
x_train_pca = pca.fit_transform(X_train_standardized)

# 6. Préparation pour CNN (reshape 100 -> 10x10)
x_train_pca_reshaped = x_train_pca.reshape(-1, 10, 10, 1)

# 7. Création du modèle CNN
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(10, 10, 1)),
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.5),  # Ajout d'un dropout pour éviter le surapprentissage
    tf.keras.layers.Dense(26, activation='softmax')
])

# 8. Compilation et entraînement
model.compile(optimizer='adam',
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Ajout d'un early stopping pour éviter le surapprentissage
early_stopping = tf.keras.callbacks.EarlyStopping(
    monitor='val_accuracy',
    patience=3,
    restore_best_weights=True
)

# Entraînement avec validation split
history = model.fit(
    x_train_pca_reshaped, 
    y_train, 
    epochs=20,
    validation_split=0.2,
    callbacks=[early_stopping]
)

# 9. Sauvegarde des composants nécessaires
np.savez('arrays_emnist.npz',
         principal_components=pca.components_.T,  # Transposée pour la multiplication matricielle
         X_mean=X_mean,
         X_std=X_std)

# Sauvegarde du modèle CNN
model.save('emnist_cnn_pca_model.keras')

# Affichage des performances
print("Performances finales:")
test_standardized = (x_test - X_mean) / X_std
test_pca = np.dot(test_standardized, pca.components_.T)
test_pca_reshaped = test_pca.reshape(-1, 10, 10, 1)
test_loss, test_accuracy = model.evaluate(test_pca_reshaped, y_test)
print(f"Test accuracy: {test_accuracy:.4f}")