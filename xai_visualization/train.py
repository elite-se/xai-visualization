import tensorflow as tf
from tensorflow.contrib.learn.python.learn.estimators._sklearn import train_test_split
from tensorflow.python.keras.utils import to_categorical

from xai_visualization.models.dense_model import create_model
import os

feature_description = {
    'armscrossed': tf.io.FixedLenFeature([], tf.float32, default_value=0),
    'label': tf.io.FixedLenFeature([], tf.int64, default_value=0)
}

def _parse_function(example_proto):
  # Parse the input `tf.Example` proto using the dictionary above.
  example = tf.io.parse_single_example(example_proto, feature_description)

  print(example)
  return example['armscrossed'], example['label']


def train(dataset_path):
    tf.compat.v1.enable_eager_execution()

    split = "train"
    pattern = os.path.join(dataset_path, '{}*.tfrecord'.format(split))
    files_ds = tf.data.Dataset.list_files(pattern)
    ds = tf.data.TFRecordDataset(files_ds)

    #ds = ds.batch(10)

    parsed_dataset = ds.map(_parse_function)

    for parsed_record in parsed_dataset.take(10):
        print(repr(parsed_record))


    # features, annotations = load_data(r'../../korpus_no_video/027_2016-04-06_Nottingham/')

    # data_train, data_test, labels_train, labels_test = train_test_split(features, annotations, test_size=0.20,random_state=42)

    model = create_model()
    model.fit(parsed_dataset, epochs=100, steps_per_epoch=30, verbose=1)

    # data_test, labels_test = load_data(r'../../korpus_no_video/030_2016-04-06_Nottingham/')
    # score = model.evaluate(data_test, labels_test)
    # print(score)
