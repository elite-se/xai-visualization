
import os
import numpy as np
import tensorflow as tf

from sklearn.model_selection import train_test_split
from tensorflow.keras.losses import categorical_crossentropy

from xai_visualization.models.dense_model import create_model as create_dense_model
from xai_visualization.models.lstm_model import create_model as create_lstm_model
from xai_visualization.util.load_data import load_folder
from xai_visualization.util.window import multivariate_data
from xai_visualization.util.plot import plot_train_history

EVALUATION_INTERVAL = 200
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

    return np.array(all_features), np.array(all_annotations)

def prepare_windowed_dataset(dataset_path):
    all_features, all_annotations = flatten_data(dataset_path) # FIXME: Currently all sessions are concated, this means that a single window can contain samples from different sessions

    STEP = 7
    HISTORY = 100
    data_train, labels_train = multivariate_data(all_features, all_annotations, 0,
                                                   int(0.8 * len(all_features)), HISTORY,
                                                   0, STEP,
                                                   single_step=True)

    data_test, labels_test = multivariate_data(all_features, all_annotations,
                                                   int(0.8 * len(all_features)), None, 100,
                                                   0, STEP,
                                                   single_step=True)
    print ('Single window of past history : {}'.format(data_train[0].shape))
    print ('Window shape : {}'.format(data_train.shape[-2:]))

    return data_train, labels_train, data_test, labels_test


def prepare_dataset(dataset_path):
    all_features, all_annotations = flatten_data(dataset_path)

    data_train, data_test, labels_train, labels_test = train_test_split(np.array(all_features), np.array(all_annotations), test_size=0.20, random_state=42)

    return data_train, labels_train, data_test, labels_test

def train(config, dataset_path, model_dir):
    #tf.compat.v1.enable_eager_execution()
    batch_size = config.batch_size
    learning_rate = config.learning_rate
    epochs = config.epochs

    data_train, labels_train, data_test, labels_test = prepare_dataset(dataset_path)
    # data_train, labels_train, data_test, labels_test = prepare_windowed_dataset(dataset_path)

    train_data = tf.data.Dataset.from_tensor_slices(
        (data_train, labels_train)
    ).cache().shuffle(BUFFER_SIZE).batch(batch_size).repeat()

    val_data = tf.data.Dataset.from_tensor_slices(
        (data_test, labels_test)
    ).batch(batch_size).repeat()

    steps_per_epoch = int(data_train.shape[0] / BUFFER_SIZE)


    # lstm_model = create_lstm_model([15,18])
    # lstm_model.compile(optimizer=tf.keras.optimizers.Adam(lr=learning_rate), loss=categorical_crossentropy, metrics=['accuracy'])
    # history = lstm_model.fit(train_data, epochs=epochs,
    #                                         steps_per_epoch=steps_per_epoch,
    #                                         validation_data=val_data,
    #                                         validation_steps=50)
    # plot_train_history(history, 'LSTM Training and validation loss')


    model = create_dense_model()
    model.compile(optimizer=tf.keras.optimizers.Adam(lr=learning_rate), loss=categorical_crossentropy, metrics=['accuracy'])
    history = model.fit(train_data, 
                    epochs=epochs,
                    steps_per_epoch=steps_per_epoch,
                    validation_data=val_data,
                    validation_steps=50
    )
    plot_train_history(history, 'Dense Training and validation loss')
