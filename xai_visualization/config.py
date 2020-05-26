import json

class Config(object):
    def __init__(self):
        pass

    def load_json(self, file_path):
        with open(file_path, 'r') as file:
            config = json.load(file)
            self.load_dict(config)

    def loads_json(self, string):
        config = json.loads(string)
        self.load_dict(config)

    def load_dict(self, config):
        self.learning_rate = config['learning_rate']
        self.batch_size = config['batch_size']
        self.epochs = config['epochs']

    def load_defaults(self):
        self.learning_rate = 0.01
        self.batch_size = 32
        self.epochs = 5

    def print(self):
        print("Current configuration: %s" % json.dumps(self.__dict__, indent=4))
