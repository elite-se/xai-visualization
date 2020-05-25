import numpy as np
import os

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


def load_features(path):
    features_file = open(path, "r")
    features = np.fromfile(features_file, dtype=np.float32)
    return features.reshape((int(features.shape[0] / 18), 18))


def load_annotations(path):
    annotations = np.genfromtxt(path, delimiter=';', dtype=np.float32)
    # remove unnecessary confidence
    annotations = annotations[:, 0]

    # discrete annotation in 3 values: low, medium and high engagement
    annotations = np.digitize(annotations, np.array([1.0 / 3.0, 2.0 / 3.0]))
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

        session = {}
        for guy in guys:
            features = load_features(os.path.join(subdir, guy + ".engagement_feature_set.stream~"))
            annotations = load_annotations(os.path.join(subdir, guy + ".engagement.gold.annotation~"))
            number_of_frames = min(features.shape[0], annotations.shape[0])
            annotations = annotations[:number_of_frames]
            features = features[:number_of_frames]
            session[guy] = (features, annotations)
        sessions.append(session)

        print('Added session ' + subdir + '.')
    return sessions
