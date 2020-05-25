from tensorflow.python.keras import Sequential
from tensorflow.python.keras.layers import Dense

def create_model():
    model = Sequential()
    model.add(Dense(1024, activation='relu'))
    model.add(Dense(512, activation='relu'))
    model.add(Dense(264, activation='relu'))
    model.add(Dense(3, activation='sigmoid'))
    return model