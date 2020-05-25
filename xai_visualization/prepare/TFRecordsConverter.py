import tensorflow as tf
import numpy as np
from tensorflow.python.keras.utils import to_categorical

def _float_feature(list_of_floats):  # float32
    return tf.train.Feature(float_list=tf.train.FloatList(value=list_of_floats))


class TFRecordsConverter:
    def __init__(self):
        pass

    def _write_tfrecord_file(self, raw_dir_path, output_dir_path):
        """Write TFRecord file."""
        with tf.io.TFRecordWriter("%s/output.tfrecord" % output_dir_path, options='ZLIB') as out:
            data = "%s/korpus_no_video/027_2016-04-06_Nottingham/" % raw_dir_path
            features_file = open(data + "expert.engagement_feature_set.stream~", "r")
            features = np.fromfile(features_file, dtype=np.float32)
            annotations = np.genfromtxt(data + "expert.engagement.gold.annotation~", delimiter=';', dtype=np.float32)
            annotations = annotations[:features.shape[0], 0]

            # discrete annotation in 3 values: low, medium and high engagement
            annotation = np.digitize(annotations, np.array([1.0 / 3.0, 2.0 / 3.0]))
            annotations = to_categorical(annotations, num_classes=3, dtype='float32')

            example = tf.train.Example(features=tf.train.Features(feature={
                    'armscrossed': _float_feature(features[3]),
                    'label': _float_feature(annotation)}))



    def convert(self, raw_dir_path, output_dir_path):
        """Convert to TFRecords.
        """
        self._write_tfrecord_file(raw_dir_path, output_dir_path)
