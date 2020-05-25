from tensorflow.python.keras import Sequential
from tensorflow.python.keras.layers import Dense
from tensorflow.python.keras.losses import categorical_crossentropy
from tensorflow.python.keras.optimizers import sgd


def create_model():
    model = Sequential()
    model.add(Dense(3, activation='sigmoid'))
    model.compile(optimizer=sgd(), loss=categorical_crossentropy, metrics=['accuracy'])
    return model