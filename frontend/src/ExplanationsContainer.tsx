import React from "react";
import styled from "styled-components";
import { HorizontalBar } from "react-chartjs-2";

const Container = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border: 1px solid gray;
    border-left: 0;

    box-sizing: border-box;
    padding: 0 8px;
`;

function ExplanationsContainer() {
    return (
        <Container>
            <h2>EXPLANATIONS</h2>
            <HorizontalBar
                data={{
                    labels: ["Face", "Valence", "Arms Crossed", "Hands"],
                    datasets: [
                        {
                            label: "Testing Explanations",
                            backgroundColor: "#00998C",
                            data: [0.4, 0.2, 0.15, 0.1],
                        },
                    ],
                }}
            />
        </Container>
    );
}

export default ExplanationsContainer;
