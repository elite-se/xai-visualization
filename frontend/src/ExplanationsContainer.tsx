import React from "react";
import styled from "styled-components";
import { HorizontalBar } from "react-chartjs-2";

const Container = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    border: 1px solid gray;
    border-left: 0;

    box-sizing: border-box;
    padding: 12px 8px;
`;

const Divider = styled.div`
    width: 90%;
    height: 1px;
    background: #a7b6c2;
    margin: 12px auto;
`;

const ConfidenceBox = styled.div`
    border: 1px solid #30404d;
    box-sizing: border-box;
    padding: 6px;
`;

const ConfidenceValue = styled.span`
    font-weight: bold;
`;

const Heading = styled.h3`
    margin: 0 0 6px 0;
    text-transform: uppercase;
`;

function ExplanationsContainer() {
    return (
        <Container>
            <Heading>Confidence</Heading>
            <ConfidenceBox>
                <ConfidenceValue>89.5%</ConfidenceValue> confident for "very engaged"
            </ConfidenceBox>
            <Divider />
            <Heading>Explanations</Heading>
            <HorizontalBar
                data={{
                    labels: ["Face", "Valence", "Arms Crossed", "Hands"],
                    datasets: [
                        {
                            label: "Testing Explanations",
                            backgroundColor: ["#14CCBD", "#9179F2", "#F2B824", "#4580E6"],
                            data: [0.4, 0.2, 0.15, 0.1],
                        },
                    ],
                }}
                options={{
                    legend: {
                        display: false,
                    },
                    scales: {
                        xAxes: [
                            {
                                ticks: {
                                    min: 0,
                                },
                            },
                        ],
                    },
                }}
            />
        </Container>
    );
}

export default ExplanationsContainer;
