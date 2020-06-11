import React from "react";
import styled from "styled-components";
import { HorizontalBar } from "react-chartjs-2";
import { Colors } from "@blueprintjs/core";

const Container = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    box-sizing: border-box;
    padding: 12px 8px;
`;

const Divider = styled.div`
    width: 90%;
    height: 1px;
    background: ${Colors.GRAY4};
    margin: 12px auto;
`;

const ConfidenceBox = styled.div`
    border: 1px solid ${Colors.DARK_GRAY4};
    box-sizing: border-box;
    padding: 6px;
`;

const ConfidenceValue = styled.span`
    font-weight: bold;
    display: inline-block;
    width: 45px;
`;

const Heading = styled.h3`
    margin: 0 0 6px 0;
    text-transform: uppercase;
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
const barChartOptions = {
    legend: {
        display: false,
    },
    scales: {
        xAxes: [
            {
                ticks: {
                    min: 0,
                    max: 1,
                },
            },
        ],
    },
    tooltips: {
        enabled: false,
    },
};

function ExplanationsContainer(props: {
    dataPoint: { input: number[]; output: number[]; explanations: number[][] };
    labels: string[];
}) {
    const { output, explanations } = props.dataPoint;
    const strongestOutputIdx = output.indexOf(Math.max(...output));
    const confidence = Math.round(output[strongestOutputIdx] * 1000) / 10;

    const nrOfDisplayedFeatures = 4;

    const counterExampleIdx = strongestOutputIdx > 1 ? 0 : 3; //use "the other side of the scala" as a counter exmple

    return (
        <Container>
            <Heading>Why "{engagement_labels[strongestOutputIdx]}"?</Heading>
            {confidence < 50 && (
                <ConfidenceBox>
                    {"Only "}
                    <ConfidenceValue>{`${confidence}%`}</ConfidenceValue>
                    {` confident for "${engagement_labels[strongestOutputIdx]}".`}
                </ConfidenceBox>
            )}
            <div style={{ width: "60%" }}>
                <HorizontalBar
                    data={{
                        labels: props.labels.slice(0, nrOfDisplayedFeatures),
                        datasets: [
                            {
                                label: "Testing Explanations",
                                backgroundColor: CHART_COLOR_PALETTE,
                                data: explanations[strongestOutputIdx],
                            },
                        ],
                    }}
                    options={barChartOptions}
                />
            </div>
            <Divider />
            <Heading>Why not "{engagement_labels[counterExampleIdx]}"?</Heading>
            <div>
                <HorizontalBar
                    data={{
                        labels: props.labels.slice(0, 2),
                        datasets: [
                            {
                                label: "Testing Explanations",
                                backgroundColor: CHART_COLOR_PALETTE.slice(9),
                                data: explanations[counterExampleIdx].slice(0, 2),
                            },
                        ],
                    }}
                    options={barChartOptions}
                />
            </div>
        </Container>
    );
}

export default ExplanationsContainer;
