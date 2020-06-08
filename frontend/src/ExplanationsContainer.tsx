import React from "react";
import styled from "styled-components";

const Container = styled.div`
    flex-grow: 1;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    border: 1px solid gray;
    border-left: 0;
`

function ExplanationsContainer() {
    return (
        <Container>
            <h2>EXPLANATIONS</h2>
        </Container>
    );
}

export default ExplanationsContainer;
