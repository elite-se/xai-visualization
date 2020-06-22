import React from "react";
import styled from "styled-components";
import {HorizontalBar} from "react-chartjs-2";
import {Colors} from "@blueprintjs/core";
import WordCloud from "./WordCloud";

const Container = styled.div`
    position: relative;
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    box-sizing: border-box;
    padding: 12px 8px;
`;

const Heading = styled.h3`
    margin: 0 0 6px 0;
    text-transform: uppercase;
    transition: 0.2s filter linear, 0.2s -webkit-filter linear;
`;

const CHART_COLOR_PALETTE = [
    Colors.ROSE3,
    Colors.ROSE4,
    Colors.ROSE5,
    Colors.VIOLET3,
    Colors.VIOLET4,
    Colors.VIOLET5,
    Colors.INDIGO3,
    Colors.INDIGO4,
    Colors.INDIGO5,
    Colors.COBALT3,
    Colors.COBALT4,
    Colors.COBALT5,
    Colors.BLUE3,
    Colors.BLUE4,
    Colors.BLUE5,
    Colors.TURQUOISE3,
    Colors.TURQUOISE4,
    Colors.TURQUOISE5,
];

const engagement_labels = ["very unattentive", "slightly unattentive", "slightly engaged", "very engaged"];
const barChartOptions = (xAxesMax: number) => {
    return {
        layout: {
            padding: {
                left: 220
            }
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
                    ticks: {
                        min: 0,
                        max: xAxesMax,
                        callback: function (value: number, index: any, values: any) {
                            if (value === 0) {
                                return 'Not important';
                            } else if (value === xAxesMax) {
                                return 'Significantly important';
                            }
                            return undefined
                        }
                    },
                },
            ],
            yAxes: [
                {
                    ticks: {
                        mirror: true,
                        padding: 220
                    }
                }
            ]
        },
    };
};

/**
 * Sorts the passed in explanations (either ascending or descending) and
 * returns all values and their labels that are (in value, regardless of sign) greater than the threshold.
 * It returns at least minNrOfFeatures values, in case that too little values are greater than the threshold.
 * @param labels
 * @param explanations_in
 * @param minNrOfFeatures
 * @param threshold
 * @param sortDescending
 */
function sortAndSelectTopmostFeatures(
    labels: string[],
    explanations_in: number[],
    minNrOfFeatures: number,
    threshold: number,
    sortDescending: boolean
): { topMostLabels: string[]; topMostFeatures: number[] } {
    if (explanations_in.length !== labels.length) throw new Error();

    let explanations = explanations_in.slice(0);
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
    for (let i = 0; i < ctr; i++) {
        topMostLables.push(labels[labelOrder[i]]);
    }

    return {
        topMostLabels: topMostLables,
        topMostFeatures: explanations.slice(0, ctr),
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
`

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
`

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
    mode: 'bar' | 'cloud'
}) {
    const {output, explanations} = props.dataPoint;
    const strongestOutputIdx = output.indexOf(Math.max(...output));
    const confidence = Math.round(output[strongestOutputIdx] * 1000) / 10;

    const strongestOutputExplanations = sortAndSelectTopmostFeatures(
        props.labels,
        explanations[strongestOutputIdx],
        3,
        0.2,
        true
    );

    const blur = calculateBlur(confidence)

    return (
        <Container>
            <Heading style={{filter: `blur(${blur}px)`}}>Why "{engagement_labels[strongestOutputIdx]}"?</Heading>
            <ChartContainer style={{width: '90%', filter: `blur(${blur}px)`}}>
                {props.mode === 'bar'
                    ? <HorizontalBar
                        data={{
                            labels: strongestOutputExplanations.topMostLabels,
                            datasets: [
                                {
                                    label: "Testing Explanations",
                                    backgroundColor: CHART_COLOR_PALETTE,
                                    data: strongestOutputExplanations.topMostFeatures,
                                },
                            ],
                        }}
                        options={barChartOptions(props.maxExplanationValue)}
                    />
                    : <WordCloud allLabels={props.labels}
                                 strongestFeatures={strongestOutputExplanations.topMostFeatures}
                                 strongestLabels={strongestOutputExplanations.topMostLabels}/>
                }
            </ChartContainer>
            <Unsure style={{opacity: blur > 0 ? 1 : 0}}>UNSURE</Unsure>
        </Container>
    );
}

export default ExplanationsContainer;
