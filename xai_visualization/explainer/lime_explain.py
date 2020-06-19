from lime.lime_tabular import LimeTabularExplainer
import numpy as np
import tensorflow as tf
from xai_visualization.util.load_data import feature_names
from tqdm import tqdm
import multiprocessing


def process_sample(explainer, probability_model, sample):
    explanation = explainer.explain_instance(
        sample, probability_model.predict, top_labels=4, num_features=18)

    explanations = np.array([explanation.local_exp[i]
                             for i in map(int, explanation.local_exp.keys())])
    indices = np.argsort(explanations[:, :, 0].astype(int), axis=1)
    per_class_explanations = np.take_along_axis(
        explanations[:, :, 1], indices, axis=1)

    return {
        'input': sample.tolist(),
        'output': explanation.predict_proba.tolist(),
        'explanations': per_class_explanations.tolist()
    }


def explain(model, samples):
    #samples = samples[:2000]
    background_dataset = samples[:1000]
    explainer = LimeTabularExplainer(
        background_dataset, feature_names=feature_names, discretize_continuous=False)
    probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])

    data = []

    for sample in tqdm(samples):
        data.append(process_sample(explainer, probability_model, sample))

    json = {
        'sampleRate': 25,
        'labels': feature_names,
        'data': data
    }

    return json
