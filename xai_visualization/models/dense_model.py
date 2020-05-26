from tensorflow.python.keras import Sequential
from tensorflow.python.keras.layers import Dense, Dropout

def create_model():
    model = Sequential()
    model.add(Dense(1024, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(512, activation='relu'))
    model.add(Dropout(0.25))
    model.add(Dense(264, activation='relu'))
    model.add(Dense(4, activation='sigmoid'))
    return model