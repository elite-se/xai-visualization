import shap
import datetime
import numpy as np
import tensorflow as tf

def explain(model, samples):

    samples = samples[:10]

    background_dataset = samples[:1000]
    explainer = shap.DeepExplainer(model, background_dataset)
    probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])

    data = []

    for sample in samples:
        # output format: [samples, classes, features(18)]
        per_class_explanations = np.squeeze(explainer.shap_values(np.array([sample])))
        data.append({
            'output': np.argmax(probability_model.predict(np.array([sample]))),
            'explanations': per_class_explanations
        })

    json = { 'data': data }

    return json