import tensorflow as tf
from tensorflow.contrib.learn.python.learn.estimators._sklearn import train_test_split
from tensorflow.python.keras.utils import to_categorical

from xai_visualization.models.dense_model import create_model
from xai_visualization.util.load_data import load_folder
import os
import numpy as np
from tensorflow.python.keras.losses import categorical_crossentropy

EVALUATION_INTERVAL = 200
EPOCHS = 10
BATCH_SIZE = 256
BUFFER_SIZE = 10000

def flatten_data(dataset_path):
    all_features = []
    all_annotations = []

    sessions = load_folder(dataset_path)
    for session in sessions:
        for features, annotations in session.values():
            for label, feature in zip(annotations, features):
                all_features.append(feature)
                all_annotations.append(label)

    return all_features, all_annotations

def prepare_dataset(dataset_path):
    all_features, all_annotations = flatten_data(dataset_path)

    data_train, data_test, labels_train, labels_test = train_test_split(np.array(all_features), np.array(all_annotations), test_size=0.20, random_state=42)

    train_data_single = tf.data.Dataset.from_tensor_slices(
        (np.array(data_train), np.array(labels_train))
    ).cache().shuffle(BUFFER_SIZE).batch(BATCH_SIZE).repeat()

    val_data_single = tf.data.Dataset.from_tensor_slices(
        (data_test, labels_test)
    ).batch(BATCH_SIZE).repeat()


    steps_per_epoch = int(data_train.shape[0] / BUFFER_SIZE)

    return train_data_single, val_data_single, steps_per_epoch

def train(dataset_path):
    #tf.compat.v1.enable_eager_execution()

    train_data_single, val_data_single, steps_per_epoch = prepare_dataset(dataset_path)

    model = create_model()

    model.compile(optimizer='adam', loss=categorical_crossentropy, metrics=['accuracy'])

    model.fit(train_data_single, 
                    epochs=EPOCHS,
                    steps_per_epoch=steps_per_epoch,
                    validation_data=val_data_single,
                    validation_steps=50
    )
