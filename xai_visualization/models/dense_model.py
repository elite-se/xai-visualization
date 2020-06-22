from tensorflow.keras import Sequential
from tensorflow.keras.layers import Dense, Dropout

def create_model(input_shape):
    model = Sequential()
    model.add(Dense(1024, activation='relu', input_shape=input_shape))
    model.add(Dropout(0.5))
    model.add(Dense(512, activation='relu'))
    model.add(Dropout(0.25))
    model.add(Dense(264, activation='relu'))
    model.add(Dense(4))
    return model