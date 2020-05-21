# xai-visualisation

This is a python module which offers scripts to start training and evaluation

# Setup

## Use Anaconda

`conda create -n tf-gpu tensorflow-gpu=1.13.1`

## Or use PIP

* `virtualenv3 venv`
* `pip install -e .`

# Run the training

* `CUDA_VISIBLE_DEVICES=1 xai-train`

# Run the evaluation

* `CUDA_VISIBLE_DEVICES=1 xai-evaluation`
