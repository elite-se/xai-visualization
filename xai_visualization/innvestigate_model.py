from innvestigate import create_analyzer
from tensorflow.python.keras.engine.saving import load_model

from xai_visualization.train import prepare_dataset


def analyze_model(model, input_data):
    analyzer = create_analyzer("gradient", model)
    analysis_result = analyzer.analyze(input_data[0])
    print(analysis_result)


data_train, labels_train, data_test, labels_test = prepare_dataset("data")
loaded_model = load_model("models/dense50")
analyze_model(loaded_model, data_test)
