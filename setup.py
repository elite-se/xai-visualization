from setuptools import find_packages, setup

setup(
    name='xai-visualization',
    packages=['xai_visualization', 'xai_visualization.models', 'xai_visualization.util'],
    scripts=['scripts/xai-train', 'scripts/xai-evaluation', 'scripts/xai-prepare'],
    version='0.1.0',
    description='HCI solutions',
    author='maxammann',
    license='MIT',
    install_requires=[
        'scipy==1.4.1',
        'matplotlib==3.2.1',
        'scikit-learn==0.23.1',
        'numpy==1.18.4',
        'tensorflow==1.13.1',
        'lime==0.2.0.0',
        'hickle==3.4.6'
    ]
)
