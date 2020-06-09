from setuptools import find_packages, setup

setup(
    name='xai-visualization',
    packages=['xai_visualization', 'xai_visualization.models', 'xai_visualization.util', 'xai_visualization.prepare'],
    scripts=['scripts/xai-train', 'scripts/xai-evaluation', 'scripts/xai-prepare', 'scripts/xai-plot', 'scripts/xai-explain', 'scripts/xai-playback'],
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
        'tensorflow==1.15',
        'lime==0.2.0.0',
        'hickle==3.4.6',
        'shap==0.35.0'
    ]
)
