from lime.lime_tabular import LimeTabularExplainer
import numpy as np
import tensorflow as tf
from xai_visualization.util.load_data import feature_names

def explain(model, samples):
    samples = samples[:10]

    background_dataset = samples[:1000]
    explainer = LimeTabularExplainer(background_dataset, feature_names=feature_names, discretize_continuous=False)
    probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])

    data = []

    for sample in samples:
        explanation = explainer.explain_instance(sample, probability_model.predict, top_labels=4, num_features=18)
       
        explanations = np.array([explanation.local_exp[i] for i in map(int, explanation.local_exp.keys())])
        indices = explanations[:,:,0].astype(int)
        indices = np.argsort(indices, axis=1)
        per_class_explanations = np.take_along_axis(explanations[:,:,1], indices, axis=1)

        per_class_explanations = None
        data.append({
            'input': sample,
            'output': explanation.predict_proba,
            'explanations': per_class_explanations
        })

    json = { 
        'sampleRate': 25,
        'labels': feature_names,
        'data': data
    }

    return json