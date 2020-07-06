import {uniq} from "lodash";

export type DataPointType = { input: number[]; output: number[]; explanations: number[][] };

export type DataContainerType = {
    sampleRate: number;
    labels: string[];
    data: DataPointType[];
    maxExplanationValue: number;
    maxInputs: number[];
    minInputs: number[];
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

const maxExplanationsAndMinMaxInputValue = (data: DataPointType[]) => {
    //initial values
    let max = data[0].explanations[0][0];
    let maxInputs = Array(data[0].input.length);
    let minInputs = Array(data[0].input.length);

    for (let y = 0; y < data[0].input.length; y++) {
        maxInputs[y] = data[0].input[y];
        minInputs[y] = data[0].input[y];
    }

    for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].explanations.length; j++) {
            for (let k = 0; k < data[i].explanations[j].length; k++) {
                if (data[i].explanations[j][k] > max) {
                    max = data[i].explanations[j][k];
                }
            }
        }
        //activation maximum and minimum
        for (let x = 0; x < data[i].input.length; x++) {
            if (data[i].input[x] > maxInputs[x]) {
                maxInputs[x] = data[i].input[x];
            } else if (data[i].input[x] < minInputs[x]) {
                minInputs[x] = data[i].input[x];
            }
        }
    }

    return {
        maxExplanation: max,
        maxInputValues: maxInputs,
        minInputValues: minInputs,
    };
};

const categorize = (oldDataContainer: DataContainerType, mapping: FeatureCategoryTextMapping[]): DataContainerType => {
    const labels = uniq(
        oldDataContainer.labels.map((label: string) => {
            const foundMapping = mapping.find((mapping) => mapping.features.includes(label));
            if (!foundMapping) {
                console.error("There is no category for feature " + label);
                throw Error();
            }
            return foundMapping.id;
        })
    );


    let newData = oldDataContainer.data.map((dataPoint) => {
        const newExplanations = [];
        for (const clazz of dataPoint.explanations) {
            const newClazz = [];
            for (const info of mapping) {
                newClazz.push(
                    info.aggregateFunction(
                        clazz.filter((explanation, index) => info.features.includes(oldDataContainer.labels[index]))
                    )
                );
            }
            newExplanations.push(newClazz);
        }

        const newInput = [];
        for (const info of mapping) {
            newInput.push(
                info.aggregateFunction(
                    dataPoint.input.filter((explanation, index) => info.features.includes(oldDataContainer.labels[index]))
                )
            );
        }

        const newDataPoint: DataPointType = {
            input: newInput,
            output: dataPoint.output,
            explanations: newExplanations,
        };
        return newDataPoint;
    });

    const maxValues = maxExplanationsAndMinMaxInputValue(newData);

    return {
        sampleRate: oldDataContainer.sampleRate,
        labels: labels,
        data: newData,
        maxExplanationValue: maxValues.maxExplanation,
        maxInputs: maxValues.maxInputValues,
        minInputs: maxValues.minInputValues,
    };
};

interface FeatureCategoryTextMapping {
    id: string;
    features: string[];
    aggregateFunction: (featureValues: number[]) => number;
}

const average = (featureValues: number[]) => {
    return featureValues.reduce((acc, value) => acc + value, 0) / featureValues.length;
};

const featuresToCategoryMapping: FeatureCategoryTextMapping[] = [
    {
        id: "Gaze",
        features: ["1 face horizontal movement (emax)", "2 face vertical movement (emax)"],
        aggregateFunction: average,
    },
    {
        id: "Smile",
        features: ["0 Valence from Face (emax)"],
        aggregateFunction: average,
    },
    {
        id: "Voice",
        features: ["15 voice activity"],
        aggregateFunction: average,
    },
    {
        id: "Armscrossed",
        features: ["3 armscrossed"],
        aggregateFunction: average,
    },
    {
        id: "Headtouch",
        features: ["4 headtouch"],
        aggregateFunction: average,
    },
    {
        id: "BodyOpenness",
        features: [
            "5 distance left hand left hip",
            "6 distance right hand right hip",
            "9 hand in front of left hip",
            "10 hand in front of right hip",
        ],
        aggregateFunction: average,
    },
    {
        id: "Restlessness",
        features: ["16 Skeleton overall activation"],
        aggregateFunction: average,
    },
    {
        id: "Gesticulation",
        features: ["17 Skeleton energy global max"],
        aggregateFunction: average,
    },
];

const loadEngagementData = async (
    username: string,
    password: string,
    dataURL: string,
    smoothWithPredictions = false,
    discretizeValues = false,
    discretizeOutputOnly = false
) => {

    await fetch("https://xai.elite-se.xyz/dologin.html", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `httpd_username=${username}&httpd_password=${encodeURIComponent(password)}`
    })
    const credentials = username + ":" + password;
    const response = await fetch(dataURL, {
        credentials: 'include',
        headers: { Authorization: "Basic " + window.btoa(credentials || "") },
    });
    const dataContainer: DataContainerType = await response.json();

    const windowSize = AVG_WINDOW_SECONDS * dataContainer.sampleRate;
    if (smoothWithPredictions) {
        dataContainer.data = smoothUsingPredictions(dataContainer, windowSize);
    } else {
        dataContainer.data = smoothData(dataContainer.data, windowSize);
    }

    let discreteDataContainer: DataContainerType = JSON.parse(JSON.stringify(dataContainer));
    discreteDataContainer.data = discretizeDataPoints(discreteDataContainer.data, dataContainer.sampleRate * 3, false);
    dataContainer.data = discretizeDataPoints(dataContainer.data, dataContainer.sampleRate * 3, true);

    let maxValues = maxExplanationsAndMinMaxInputValue(dataContainer.data);
    dataContainer.maxExplanationValue = maxValues.maxExplanation;
    dataContainer.maxInputs = maxValues.maxInputValues;
    dataContainer.minInputs = maxValues.minInputValues;
    return [categorize(dataContainer, featuresToCategoryMapping), categorize(discreteDataContainer, featuresToCategoryMapping)];
};

const smoothUsingPredictions = (dataContainer: DataContainerType, windowSize: number): DataPointType[] => {
    let lastOutput = dataContainer.data[0].output.indexOf(Math.max(...dataContainer.data[0].output));
    let currentWindowStart = 0;
    let longWindowStart = 0;
    let windowedData: DataPointType[] = [];
    const minWindowSize = 5 * dataContainer.sampleRate;
    let i;
    for (i = 1; i < dataContainer.data.length; i++) {
        const prediction = dataContainer.data[i].output.indexOf(Math.max(...dataContainer.data[i].output));
        if (lastOutput !== prediction) {
            if (i - currentWindowStart >= minWindowSize || i + 1 === dataContainer.data.length) {
                if (longWindowStart < currentWindowStart) {
                    windowedData = windowedData.concat(
                        smoothData(dataContainer.data.slice(longWindowStart, currentWindowStart), windowSize)
                    );
                    longWindowStart = i;
                }
                windowedData = windowedData.concat(
                    smoothData(dataContainer.data.slice(currentWindowStart, i), windowSize)
                );
            }
            lastOutput = prediction;
            currentWindowStart = i;
        }
    }
    windowedData = windowedData.concat(smoothData(dataContainer.data.slice(currentWindowStart, i), windowSize));
    return windowedData;
};

const discretizeDataPoints = (data: DataPointType[], intervalFrames: number, outputOnly = false): DataPointType[] => {
    let inputLength = data[0].input.length;
    let outputLength = data[0].output.length;
    let explanationsLength = data[0].explanations.length;
    const smoothedData: DataPointType[] = Array(data.length);
    for (let currentIntervalStart = 0; currentIntervalStart < data.length; currentIntervalStart += intervalFrames) {
        let currentIntervalEnd = currentIntervalStart + intervalFrames;
        if (currentIntervalEnd > data.length) currentIntervalEnd = data.length;
        let currentIntervalLength = currentIntervalEnd - currentIntervalStart;
        if (currentIntervalLength === 0) {
            break;
        }
        let averagePoint: DataPointType = {
            input: new Array(inputLength).fill(0),
            output: new Array(outputLength).fill(0),
            explanations: new Array(explanationsLength).fill(new Array(data[0].explanations[0].length).fill(0))
        }
        for (let i = currentIntervalStart; i < currentIntervalEnd; i++) {
            averagePoint.input = averagePoint.input.map((val, j) => val + data[i].input[j]);
            averagePoint.output = averagePoint.output.map((val, j) => val + data[i].output[j]);
            averagePoint.explanations = averagePoint.explanations.map((row, j) =>
                row.map((val, k) => val + data[i].explanations[j][k])
            );
        }
        averagePoint.input = averagePoint.input.map((val) => val / currentIntervalLength);
        averagePoint.output = averagePoint.output.map((val) => val / currentIntervalLength);
        averagePoint.explanations = averagePoint.explanations.map((row) =>
            row.map((val) => val / currentIntervalLength)
        );

        for (let i = currentIntervalStart; i < currentIntervalEnd; i++) {
            if (outputOnly) {
                smoothedData[i] = data[i];
                smoothedData[i].output = averagePoint.output;
            } else {
                smoothedData[i] = averagePoint;
            }
        }
    }
    return smoothedData;
};

export default loadEngagementData;
