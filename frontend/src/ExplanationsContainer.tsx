import React from "react";
import styled from "styled-components";
import { HorizontalBar } from "react-chartjs-2";
import { Colors } from "@blueprintjs/core";
import WordCloud from "./WordCloud";
import FeatureActivationTextDescription from "./FeatureActivationTextDescription";
import { Gender } from "./FeaturesToTextMapping";
import {
    ENGAGEMENT_LABELS,
    ENGAGEMENT_COLORS,
    ENGAGEMENT_POSITIVE_COLOR_PALETTE,
    ENGAGEMENT_NEGATIVE_COLOR_PALETTE,
} from "./EngagementDefinitions";

const Container = styled.div`
    position: relative;
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    box-sizing: border-box;
    padding: 12px 16px;
`;

const Heading = styled.div`
    display: flex;
    align-items: center;
    padding: 4px 6px;
    border: 2px solid ${Colors.LIGHT_GRAY2}55;
    margin: 0 0 6px 0;
    transition: 0.2s filter linear, 0.2s -webkit-filter linear;

    p {
        margin: 0;
    }

    .classification {
        text-transform: uppercase;
        margin: 0;
        margin-left: 4px;
    }
`;

const BasedOn = styled.div`
    align-self: start;
    display: flex;
    align-items: center;
    margin: 8px 0;
    transition: 0.2s filter linear, 0.2s -webkit-filter linear;

    h4 {
        margin: 0;
        margin-right: 6px;
    }
`;

const barChartOptions = (xAxesMax: number) => {
    return {
        layout: {
            padding: {
                left: 220,
            },
        },
        legend: {
            display: false,
        },
        tooltips: {
            enabled: false,
        },
        scales: {
            xAxes: [
                {
                    position: "top",
                    ticks: {
                        min: 0,
                        max: xAxesMax,
                        callback: function (value: number, index: any, values: any) {
                            if (value === 0) {
                                return "Not important";
                            } else if (value === xAxesMax) {
                                return "Significantly important";
                            }
                            return undefined;
                        },
                        fontSize: 16,
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        mirror: true,
                        padding: 220,
                        fontSize: 16,
                        fontStyle: "bold",
                    },
                },
            ],
        },
    };
};

/**
 * Sorts the passed in explanations (either ascending or descending) and
 * returns all values and their labels that are (in value, regardless of sign) greater than the threshold.
 * It returns at least minNrOfFeatures values, in case that too little values are greater than the threshold.
 * @param labels
 * @param inputs_in
 * @param explanations_in
 * @param minNrOfFeatures
 * @param threshold
 * @param sortDescending
 */
function sortAndSelectTopmostFeatures(
    labels: string[],
    inputs_in: number[],
    explanations_in: number[],
    minNrOfFeatures: number,
    threshold: number,
    sortDescending: boolean
): { topMostLabels: string[]; topMostExplanations: number[]; topMostInputs: number[] } {
    if (explanations_in.length !== labels.length) throw new Error();

    let explanations = explanations_in.slice(0);
    let inputs = inputs_in.slice(0);
    let labelOrder = Array.from(Array(explanations.length).keys()).sort((a, b) => explanations[a] - explanations[b]);
    explanations.sort((a, b) => a - b);

    if (sortDescending) {
        labelOrder.reverse();
        explanations.reverse();
    }

    //Does this "normalisation" make sense?
    //It would keep our displayed values between 0..1 but also distort between frames:
    //if on one frame we have a lot of big values and on another no big values at all,
    //the relations between the values might look the same for those frames, even though the networks "activation" was not the same at all

    //const sumExplanation = explanations.reduce((a, b) => Math.abs(a) + Math.abs(b), 0);
    //explanations = explanations.map((x) => x / sumExplanation); //normalize

    let ctr = minNrOfFeatures;
    let findMoreFeatures = true;
    while (findMoreFeatures) {
        if (Math.abs(explanations[ctr]) >= threshold) {
            ctr++;
        } else {
            findMoreFeatures = false;
        }
    }

    let topMostLables = [];
    let topMostInputs = [];
    for (let i = 0; i < ctr; i++) {
        topMostLables.push(labels[labelOrder[i]]);
        topMostInputs.push(inputs[labelOrder[i]]);
    }

    return {
        topMostLabels: topMostLables,
        topMostExplanations: explanations.slice(0, ctr),
        topMostInputs: topMostInputs,
    };
}

const confidenceBlur = {
    "100": 0,
    "50": 2,
    "30": 4,
    "10": 8,
};

const ChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 60%;
    height: 100%;
    transition: 0.2s filter linear, 0.2s -webkit-filter linear;
    filter: blur(0px);
`;

const Unsure = styled.div`
    position: absolute;
    top: calc(50% - 25px);
    margin: 0 auto;
    transition: 0.5s opacity;
    font-weight: bold;
    font-size: 50px;
    line-height: 50px;
    text-shadow: 1px 1px 10px #fff, 1px 1px 10px #ccc;
    text-align: center;
`;

const calculateBlur = (confidence: number) => {
    const entry = Object.entries(confidenceBlur).find(([percentage, blur]) => parseInt(percentage) >= confidence);

    if (!entry) {
        return 0;
    }

    return entry[1];
};

function ExplanationsContainer(props: {
    dataPoint: { input: number[]; output: number[]; explanations: number[][] };
    labels: string[];
    maxExplanationValue: number;
    mode: "bar" | "cloud";
    username: string;
}) {
    const { input, output, explanations } = props.dataPoint;
    const strongestOutputIdx = output.indexOf(Math.max(...output));
    const confidence = Math.round(output[strongestOutputIdx] * 1000) / 10;

    const strongestOutputExplanations = sortAndSelectTopmostFeatures(
        props.labels,
        input,
        explanations[strongestOutputIdx],
        3,
        0.2,
        true
    );

    const blur = calculateBlur(confidence);
    const colorPalette = strongestOutputIdx < 2 ? ENGAGEMENT_NEGATIVE_COLOR_PALETTE : ENGAGEMENT_POSITIVE_COLOR_PALETTE;

    return (
        <Container>
            <Heading style={{ filter: `blur(${blur}px)`, borderColor: ENGAGEMENT_COLORS[strongestOutputIdx] }}>
                <p>The AI detects: </p>
                <h3 className="classification">{ENGAGEMENT_LABELS[strongestOutputIdx]}</h3>
            </Heading>
            <BasedOn style={{ filter: `blur(${blur}px)` }}>
                <h4>Based on: </h4>
                <FeatureActivationTextDescription
                    categoryIds={strongestOutputExplanations.topMostLabels}
                    categoryValues={strongestOutputExplanations.topMostInputs}
                    username={props.username}
                    userGender={Gender.MALE}
                    popOverDisabled={blur > 0}
                ></FeatureActivationTextDescription>
            </BasedOn>
            <ChartContainer style={{ width: "90%", filter: `blur(${blur}px)` }}>
                {props.mode === "bar" ? (
                    <HorizontalBar
                        data={{
                            labels: strongestOutputExplanations.topMostLabels,
                            datasets: [
                                {
                                    label: "Testing Explanations",
                                    backgroundColor: colorPalette,
                                    data: strongestOutputExplanations.topMostExplanations,
                                },
                            ],
                        }}
                        options={barChartOptions(props.maxExplanationValue)}
                    />
                ) : (
                    <WordCloud
                        allLabels={props.labels}
                        maxExplanationValue={props.maxExplanationValue}
                        strongestFeatures={strongestOutputExplanations.topMostExplanations}
                        strongestLabels={strongestOutputExplanations.topMostLabels}
                        colorPalette={colorPalette}
                    />
                )}
            </ChartContainer>
            <Unsure style={{ opacity: blur > 0 ? 1 : 0 }}>UNSURE</Unsure>
        </Container>
    );
}

export default ExplanationsContainer;
