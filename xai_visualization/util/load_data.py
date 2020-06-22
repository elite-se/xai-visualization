import numpy as np
import os
from tensorflow.keras.utils import to_categorical

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

FEATURE_MASK = [
    True,  # 0 Valence from Face (emax) (calculated on several AUs)
    True,  # 1 face horizontal movement (emax)
    True,  # 2 face vertical movement (emax)
    True,  # 3 armscrossed
    True,  # 4 headtouch
    True,  # 5 distance left hand left hip
    True,  # 6 distance right hand right hip
    False,  # 7 left elbow y rotation
    False,  # 8 right elbow y rotation
    True,  # 9 hand in front of left hip
    True,  # 10 hand in front of right hip
    False,  # 11 left elbow x rotation
    False,  # 12 right elbow x rotation
    False,  # 13 standard deviation head x position
    False,  # 14 standard deviation head x rotation
    True,  # 15 voice activity
    True,  # 16 Skeleton overall activation
    True,  # 17 Skeleton energy global max
]

NUM_FEATURES = len(np.array(FEATURE_MASK)[FEATURE_MASK])

def load_features(subdir, guy):
    path = os.path.join(subdir, guy + ".engagement_feature_set.stream~")
    features_file = open(path, "r")
    features = np.fromfile(features_file, dtype=np.float32)
    features = features.reshape((int(features.shape[0] / 18), 18))
    return features[:,FEATURE_MASK]


def load_annotations(subdir, guy):
    path = os.path.join(subdir, guy + ".engagement.gold.annotation~")
    annotations = np.genfromtxt(path, delimiter=';', dtype=np.float32)
    # remove unnecessary confidence
    annotations = annotations[:, 0]

    # discrete annotation in 3 values: low, medium and high engagement
    annotations = np.digitize(annotations, [0.25, 0.5, 0.75])
    annotations = to_categorical(annotations, num_classes=4, dtype='float32')
    return annotations

def load_folder(path):
    sessions = []
    for subdir, dirs, files in os.walk(path):
        guys = ['expert', 'novice']
        if not all([ guy + '.engagement_feature_set.stream~' in files
                 and guy + '.engagement.gold.annotation~' in files
                 for guy in guys]):
            print('Folder ' + subdir + ' invalid. Skipping...')
            continue

        session = {'path': subdir}
        for guy in guys:
            features = load_features(subdir, guy)
            annotations = load_annotations(subdir, guy)
            number_of_frames = min(features.shape[0], annotations.shape[0])
            annotations = annotations[:number_of_frames]
            features = features[:number_of_frames]
            session[guy] = (features, annotations)
        sessions.append(session)

        print('Added session ' + subdir + '.')
    return sessions

feature_names = np.array([
    '0 Valence from Face (emax)',
    '1 face horizontal movement (emax)',
    '2 face vertical movement (emax)',
    '3 armscrossed',
    '4 headtouch',
    '5 distance left hand left hip',
    '6 distance right hand right hip',
    '7 left elbow y rotation',
    '8 right elbow y rotation',
    '9 hand in front of left hip',
    '10 hand in front of right hip',
    '11 left elbow x rotation',
    '12 right elbow x rotation',
    '13 standard deviation head x position',
    '14 standard deviation head x rotation',
    '15 voice activity',
    '16 Skeleton overall activation',
    '17 Skeleton energy global max'
])[FEATURE_MASK]