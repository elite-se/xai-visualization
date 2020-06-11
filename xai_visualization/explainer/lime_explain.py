from lime.lime_tabular import LimeTabularExplainer
import numpy as np
import tensorflow as tf
from xai_visualization.util.load_data import feature_names

def explain(model, samples):
    background_dataset = samples[:1000]
    explainer = LimeTabularExplainer(background_dataset, feature_names=feature_names, discretize_continuous=False)
    probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])

    data = []

    for sample in samples:
        explanation = explainer.explain_instance(sample, probability_model.predict, top_labels=4, num_features=18)
       
        explanations = np.array([explanation.local_exp[i] for i in map(int, explanation.local_exp.keys())])
        indices = np.argsort(explanations[:,:,0].astype(int), axis=1)
        per_class_explanations = np.take_along_axis(explanations[:,:,1], indices, axis=1)

        data.append({
            'input': sample.tolist(),
            'output': explanation.predict_proba.tolist(),
            'explanations': per_class_explanations.tolist()
        })

    json = { 
        'sampleRate': 25,
        'labels': feature_names,
        'data': data
    }

    return json