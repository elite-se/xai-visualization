import matplotlib.pyplot as plt

def plot_train_history(history, title):
  print(history.history)
  loss = history.history['loss']
  val_loss = history.history['val_loss']
  acc = history.history['accuracy']
  val_acc = history.history['val_accuracy']

  epochs = range(len(loss))

  plt.figure()

  plt.plot(epochs, loss, 'b', label='Training loss')
  plt.plot(epochs, val_loss, 'r', label='Validation loss')
  plt.plot(epochs, acc, 'g', label='Training Accuracy')
  plt.plot(epochs, val_acc, 'c', label='Validation Accuracy')
  plt.title(title)
  plt.legend()

  plt.show()
