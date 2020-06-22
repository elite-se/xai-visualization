import json

def round_floats(o):
    if isinstance(o, float):
        return round(o, 4)
    if isinstance(o, dict):
        return {k: round_floats(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [round_floats(x) for x in o]
    return o


def dump_json(json_data, output):
    with open(output, 'w') as f:
        json.dump(round_floats(json_data), f, separators=(',', ':'))
