import tensorflow as tf
import numpy as np
import pandas as pd

# 1. Chargement des données
train_df = pd.read_csv('../emnist/emnist-letters-train.csv', header=None)
test_df = pd.read_csv('../emnist/emnist-letters-test.csv', header=None)

# 2. Préparation des données
y_train = train_df.iloc[:, 0].values - 1
x_train = train_df.iloc[:, 1:].values
y_test = test_df.iloc[:, 0].values - 1
x_test = test_df.iloc[:, 1:].values

# 3. Normalisation et reshape pour CNN
x_train = x_train.astype('float32') / 255.0
x_test = x_test.astype('float32') / 255.0

x_train = x_train.reshape(-1, 28, 28, 1)
x_test = x_test.reshape(-1, 28, 28, 1)

# 4. Création du modèle CNN
model = tf.keras.Sequential([
    tf.keras.layers.Input(shape=(28, 28, 1)),
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(26, activation='softmax')
])

# 5. Compilation et entraînement
model.compile(optimizer='adam',
             loss='sparse_categorical_crossentropy',
             metrics=['accuracy'])

# Early stopping
early_stopping = tf.keras.callbacks.EarlyStopping(
    monitor='val_accuracy',
    patience=3,
    restore_best_weights=True
)

# Entraînement
history = model.fit(
    x_train,
    y_train,
    epochs=20,
    validation_split=0.2,
    callbacks=[early_stopping]
)

# 6. Sauvegarde du modèle
model.save('emnist_cnn_model.keras')

# 7. Évaluation sur le jeu de test
test_loss, test_accuracy = model.evaluate(x_test, y_test)
print(f"Test accuracy: {test_accuracy:.4f}") 