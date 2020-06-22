import generateMockData from "./generateMockData";

export type DataPointType = { input: number[]; output: number[]; explanations: number[][] };

export type DataContainerType = {
    sampleRate: number;
    labels: string[];
    data: DataPointType[];
    maxExplanationValue: number;
};

const AVG_WINDOW_SECONDS = 10; // Moving Average Window Size in seconds
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

const loadEngagementData = async (username: string, password: string) => {
    try {
        const credentials = username + ":" + password;
        const response = await fetch("https://xn--ls8h.maxammann.org/001_2016-03-17_Paris/lime-novice.video.mp4.json", {
            headers: { Authorization: "Basic " + window.btoa(credentials || "") },
        });
        const dataContainer: DataContainerType = await response.json();
        const windowSize = AVG_WINDOW_SECONDS * dataContainer.sampleRate;
        dataContainer.data = smoothData(dataContainer.data, windowSize);
        dataContainer.maxExplanationValue = maxExplanationsValue(dataContainer.data);
        return dataContainer;
    } catch (e) {
        console.error("Error loading or smoothing data. Using mocks");
        return generateMockData() as DataContainerType;
    }
};

export default loadEngagementData;