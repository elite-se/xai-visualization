from setuptools import find_packages, setup

setup(
    name='xai-visualization',
    packages=['xai_visualization', 'xai_visualization.models', 'xai_visualization.util'],
    scripts=['scripts/xai-train', 'scripts/xai-plot', 'scripts/xai-explain', 'scripts/xai-explain-world'],
    version='0.1.0',
    description='HCI solutions',
    author='maxammann',
    license='MIT',
    install_requires=[
        'opencv-python',
        'imutils==0.5.3',
        'scipy==1.4.1',
        'matplotlib==3.2.1',
        'scikit-learn==0.23.1',
        'numpy==1.16.4',
        'tensorflow==2.3.1',
        'lime==0.2.0.0',
        'hickle==3.4.6',
        'shap==0.35.0',
        'tqdm',
        'lime==0.2.0.0'
    ]
)
