import shap
import numpy as np
import tensorflow as tf
from xai_visualization.util.load_data import feature_names
from tqdm import tqdm

def explain(model, samples):
    #samples = samples[:100]

    background_dataset = samples[:1000]
    explainer = shap.DeepExplainer(model, background_dataset)
    probability_model = tf.keras.Sequential([model, tf.keras.layers.Softmax()])


    data = []

    for sample in tqdm(samples):
        # output format: [samples, classes, features(18)]
        per_class_explanations = np.squeeze(explainer.shap_values(np.array([sample])))
        data.append({
            'input': np.around(sample, 4).tolist(),
            'output': np.around(probability_model.predict(np.array([sample])), 4).tolist(),
            'explanations': np.around(per_class_explanations, 4).tolist()
        })

    json = {'sampleRate': 25,
            'labels': feature_names,
            'data': data
    }

    return json