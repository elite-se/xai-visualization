from tensorflow.python.keras import Sequential
from tensorflow.python.keras.layers import Dense, LSTM

def create_model(window_shape):
    model = Sequential()

    model.add(LSTM(32, input_shape=window_shape))
    model.add(Dense(264, activation='relu'))
    model.add(Dense(4, activation='sigmoid'))

    return model