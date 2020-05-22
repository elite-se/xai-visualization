import tensorflow as tf
from tensorflow.contrib.learn.python.learn.estimators._sklearn import train_test_split
from tensorflow.python.keras.utils import to_categorical

from xai_visualization.models.dense_model import create_model
from xai_visualization.util.load_data import load_data


def train():
    features, annotations = load_data(r'../../korpus_no_video/027_2016-04-06_Nottingham/')

    data_train, data_test, labels_train, labels_test = train_test_split(features, annotations, test_size=0.20,
                                                                        random_state=42)

    model = create_model()
    model.fit(data_train, labels_train, batch_size=128, epochs=100, verbose=1, validation_data=(data_test, labels_test))

    data_test, labels_test = load_data(r'../../korpus_no_video/030_2016-04-06_Nottingham/')
    score = model.evaluate(data_test, labels_test)
    print(score)

train()