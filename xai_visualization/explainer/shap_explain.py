import shap
import datetime
import numpy as np

def explain(model, samples):

    samples = samples[:10]

    background_dataset = samples[:1000]
    explainer = shap.DeepExplainer(model, background_dataset)

    shap_values = []

    before_explainer_time = datetime.datetime.now()
    for sample in samples:
        # output format: [samples, classes, features(18)]
        shap_values.append(np.squeeze(explainer.shap_values(np.array([sample]))))

    after_explainer_time = datetime.datetime.now()
    time_difference = after_explainer_time - before_explainer_time
    print(time_difference.seconds)
