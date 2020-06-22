import generateMockData from "./generateMockData";

export type DataPointType = { input: number[]; output: number[]; explanations: number[][] };

export type DataContainerType = {
    sampleRate: number;
    labels: string[];
    data: DataPointType[];
    maxExplanationValue: number;
};

const AVG_WINDOW_SECONDS = 5; // Moving Average Window Size in seconds
const smoothData = (data: DataPointType[], windowSize: number): DataPointType[] => {
    const smoothedData: DataPointType[] = Array(data.length);
    for (let i = 0; i < data.length; i++) {
        if (i === 0) {
            smoothedData[i] = data[i];
        } else if (i < windowSize) {
            // Adding the i+1-st item to the window
            // Formula: (smoothedData[i - 1] * i + data[i]) / (i + 1)
            const smoothedExplanations = data[i].explanations.map((row, j) =>
                row.map((val, k) => (smoothedData[i - 1].explanations[j][k] * i + val) / (i + 1))
            );
            const smoothedInput = data[i].input.map((val, j) => (smoothedData[i - 1].input[j] * i + val) / (i + 1));
            const smoothedOutput = data[i].output.map((val, j) => (smoothedData[i - 1].output[j] * i + val) / (i + 1));

            smoothedData[i] = { explanations: smoothedExplanations, input: smoothedInput, output: smoothedOutput };
        } else {
            // Formula: smoothedData[i - 1] + (data[i] - data[i-windowSize]) / windowSize
            const smoothedExplanations = data[i].explanations.map((row, j) =>
                row.map(
                    (val, k) =>
                        smoothedData[i - 1].explanations[j][k] +
                        (val - data[i - windowSize].explanations[j][k]) / windowSize
                )
            );
            const smoothedInput = data[i].input.map(
                (val, j) => smoothedData[i - 1].input[j] + (val - data[i - windowSize].input[j]) / windowSize
            );
            const smoothedOutput = data[i].output.map(
                (val, j) => smoothedData[i - 1].output[j] + (val - data[i - windowSize].output[j]) / windowSize
            );

            smoothedData[i] = { explanations: smoothedExplanations, input: smoothedInput, output: smoothedOutput };
        }
    }
    return smoothedData;
};

const maxExplanationsValue = (data: DataPointType[]) => {
    let max = data[0].explanations[0][0];
    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].explanations.length; j++) {
            for (let k = 0; k < data[i].explanations[j].length; k++) {
                if (data[i].explanations[j][k] > max) {
                    max = data[i].explanations[j][k];
                }
            }
        }
    }

    return max;
};

const loadEngagementData = async (username: string, password: string, dataURL: string, smoothWithPredictions: boolean = false) => {
    try {
        const credentials = username + ":" + password;
        const response = await fetch(dataURL, {
            headers: { Authorization: "Basic " + window.btoa(credentials || "") },
        });
        const dataContainer: DataContainerType = await response.json();
        
        const windowSize = AVG_WINDOW_SECONDS * dataContainer.sampleRate;
        if (smoothWithPredictions) {
            dataContainer.data = smoothUsingPredictions(dataContainer, windowSize);
        } else {
            dataContainer.data = smoothData(dataContainer.data, windowSize);
        }
        
        dataContainer.maxExplanationValue = maxExplanationsValue(dataContainer.data);
        return dataContainer;
    } catch (e) {
        console.error("Error loading or smoothing data. Using mocks");
        return generateMockData() as DataContainerType;
    }
};

const smoothUsingPredictions = (dataContainer: DataContainerType, windowSize: number): DataPointType[] => {
    let lastOutput = dataContainer.data[0].output.indexOf(Math.max(...dataContainer.data[0].output));
    let currentWindowStart = 0;
    let longWindowStart = 0;
    let windowedData: DataPointType[] = [];
    const minWindowSize = 5 * dataContainer.sampleRate;
    for (var i = 1; i < dataContainer.data.length; i++) {
        const prediction = dataContainer.data[i].output.indexOf(Math.max(...dataContainer.data[i].output));
        if (lastOutput !== prediction) {
            if (i - currentWindowStart >= minWindowSize || i + 1 == dataContainer.data.length) {
                if (longWindowStart < currentWindowStart) {
                    windowedData = windowedData.concat(smoothData(dataContainer.data.slice(longWindowStart, currentWindowStart), windowSize));
                    longWindowStart = i;
                }
                windowedData = windowedData.concat(smoothData(dataContainer.data.slice(currentWindowStart, i), windowSize));
            }
            lastOutput = prediction;
            currentWindowStart = i;
        }
    }
    windowedData = windowedData.concat(smoothData(dataContainer.data.slice(currentWindowStart, i), windowSize));
    return windowedData;
}

export default loadEngagementData;
