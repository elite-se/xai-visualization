# xai-visualisation

This is a python module which offers scripts to start training and evaluation

# Usage

### Setup using Anaconda

```
    conda create -c anaconda -n tf-gpu tensorflow-gpu=1.15
    activate tf-gpu
    pip install -e .
```

### Run the training
To run the training, place the contents of `korpus_no_video` in the `data` folder.

In an activated (and set up) conda environment run:

`xai-train`

### Generate explanations

`xai-explain`


### Plot the data

`xai-plot`
