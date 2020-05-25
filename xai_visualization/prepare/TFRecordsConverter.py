import tensorflow as tf
import numpy as np
from xai_visualization.util.load_data import load_folder

def _float_feature(list_of_floats):
    return tf.train.Feature(float_list=tf.train.FloatList(value=list_of_floats))

def _int_feature(list_of_ints):
    return tf.train.Feature(int64_list=tf.train.Int64List(value=list_of_ints))

class TFRecordsConverter:
    def __init__(self):
        pass

    def create_example(self, features, annotations):
        return tf.train.Example(features=tf.train.Features(feature={
            'armscrossed': _float_feature([features[3]]),
            'label': _int_feature([annotations])}))

    def _write_tfrecord_file(self, raw_dir_path, output_dir_path):
        """Write TFRecord file."""

        sessions = load_folder(raw_dir_path)
        with tf.io.TFRecordWriter("%s/train_sessions.tfrecord" % output_dir_path) as writer:
            for session in sessions:
                expert_features, expert_annotations = session['expert']
                novice_features, novice_annotations = session['novice']

                for features, annotation in zip(expert_features, expert_annotations):
                    writer.write(self.create_example(features, annotation).SerializeToString())
                for features, annotation in zip(novice_features, novice_annotations):
                    writer.write(self.create_example(features, annotation).SerializeToString())


    def convert(self, raw_dir_path, output_dir_path):
        """Convert to TFRecords.
        """
        self._write_tfrecord_file(raw_dir_path, output_dir_path)
