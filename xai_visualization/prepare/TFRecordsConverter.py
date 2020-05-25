import tensorflow as tf
import numpy as np
from xai_visualization.util.load_data import load_folder

def _float_feature(list_of_floats):  # float32
    return tf.train.Feature(float_list=tf.train.FloatList(value=list_of_floats))

class TFRecordsConverter:
    def __init__(self):
        pass

    def create_example(self, features, annotations):
        return tf.train.Example(features=tf.train.Features(feature={
            'armscrossed': _float_feature(features[3]),
            'label': _float_feature(annotations)}))

    def _write_tfrecord_file(self, raw_dir_path, output_dir_path):
        """Write TFRecord file."""

        sessions = load_folder(raw_dir_path)
        with tf.io.TFRecordWriter("%s/sessions.tfrecord" % output_dir_path, options='ZLIB') as writer:
            
            for session in sessions:
                expert_features, expert_annotations = session['expert']
                novice_features, novice_annotations = session['novice']

                writer.write(self.create_example(expert_features, expert_annotations).SerializeToString())
                writer.write(self.create_example(novice_features, novice_annotations).SerializeToString())


    def convert(self, raw_dir_path, output_dir_path):
        """Convert to TFRecords.
        """
        self._write_tfrecord_file(raw_dir_path, output_dir_path)
