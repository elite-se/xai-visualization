const confidenceBlur = {
    "100": 0,
    "50": 2,
    "30": 4,
    "10": 8,
};

const calculateBlur = (confidence: number) => {
    const entry = Object.entries(confidenceBlur).find(([percentage, blur]) => parseInt(percentage) >= confidence);

    if (!entry) {
        return 0;
    }

    return entry[1];
};

export default calculateBlur
