from innvestigate import create_analyzer
import tensorflow as tf
from xai_visualization.train import prepare_dataset


def analyze_model(model, input_data):
    print(input_data[0].shape)
    analyzer = create_analyzer("gradient", model)
    analysis_result = analyzer.analyze(input_data[0:1])
    print(analysis_result)

tf.compat.v1.disable_eager_execution()
data_train, labels_train, data_test, labels_test = prepare_dataset("data")
loaded_model = tf.keras.models.load_model("models/test")
analyze_model(loaded_model, data_test)
