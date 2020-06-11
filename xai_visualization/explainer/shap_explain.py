import shap
import numpy as np
import tensorflow as tf
from xai_visualization.util.load_data import feature_names

def explain(model, samples):

    # samples = samples[:10]

    background_dataset = samples[:1000]
    explainer = shap.DeepExplainer(model, background_dataset)
    probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])


    data = []

    for sample in samples:
        # output format: [samples, classes, features(18)]
        per_class_explanations = np.squeeze(explainer.shap_values(np.array([sample])))
        data.append({
            'input': sample.tolist(),
            'output': probability_model.predict(np.array([sample])).tolist(),
            'explanations': per_class_explanations.tolist()
        })

    json = {'sampleRate': 25,
            'labels': feature_names,
            'data': data
            }

    return json