# xai-visualisation

This is a python module which offers scripts to start training and evaluation

# Usage

### Setup using Anaconda
For Windows use these commnands:
```
    conda create -c anaconda -n tf-gpu tensorflow-gpu=1.13.1
    activate tf-gpu
    pip install -e .
```

### Run the training
To run the training, place the contents of `korpus_no_video` in the `data` folder.

In an activated (and set up) conda environment run:

`python scripts/xai-train`

### Run the evaluation

In activated (and set up) conda environment run:

`python scripts/xai-evaluation`

