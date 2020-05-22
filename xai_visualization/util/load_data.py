import numpy as np


# every feature stream comes with two files, .stream and .stream~.
# The first one has general information about the data, e.g. sample rate, number of dimension.
# The ~ file contains the actual data.


# keep in mind that the samples are loaded in an 1-dimensional array
# to make the following computation easier it makes sense to reshape the array
# the engagement feature set contains out of 18 different features therefore a dimension of 18


# the different dimensions translate into the following features:

# 0 Valence from Face (emax) (calculated on several AUs)
# 1 face horizontal movement (emax)
# 2 face vertical movement (emax)
# 3 armscrossed
# 4 headtouch
# 5 distance left hand left hip
# 6 distance right hand right hip
# 7 left elbow y rotation
# 8 right elbow y rotation
# 9 hand in front of left hip
# 10 hand in front of right hip
# 11 left elbow x rotation
# 12 right elbow x rotation
# 13 standard deviation head x position
# 14 standard deviation head x rotation
# 15 voice activity
# 16 Skeleton overall activation
# 17 Skeleton energy global max


# (samples, dimensions)
from tensorflow.python.keras.utils import to_categorical


def load_data(path):
    features_file = open(path + "expert.engagement_feature_set.stream~", "r")
    features = np.fromfile(features_file, dtype=np.float32)
    features = features.reshape((int(features.shape[0] / 18), 18))
    annotations = np.genfromtxt(path + "expert.engagement.gold.annotation~", delimiter=';', dtype=np.float32)
    annotations = annotations[:features.shape[0], 0]

    # discrete annotation in 3 values: low, medium and high engagement
    annotation = np.digitize(annotations, np.array([1.0 / 3.0, 2.0 / 3.0]))
    annotations = to_categorical(annotations, num_classes=3, dtype='float32')
    return features, annotations
