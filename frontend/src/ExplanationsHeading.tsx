import React from "react";
import styled from "styled-components";
import {Colors} from "@blueprintjs/core";
import {ENGAGEMENT_COLORS, ENGAGEMENT_LABELS,} from "./EngagementDefinitions";

const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    font-size: 1.6em;
    padding: 4px 6px;
    border: 2px solid ${Colors.LIGHT_GRAY2}55;
    margin: 0 0 12px 0;
    transition: 0.2s filter linear, 0.2s -webkit-filter linear;

    b {
        text-transform: uppercase;
        font-size: 1.6em;
        margin: 0 0 0 12px;
    }
`;

function ExplanationsHeading(props: {
    strongestOutputIdx: number
}) {
    const {strongestOutputIdx} = props;
    return <StyledDiv style={{borderColor: ENGAGEMENT_COLORS[strongestOutputIdx]}}>
        <span>The AI detects: </span>
        <b>{ENGAGEMENT_LABELS[strongestOutputIdx]}</b>
    </StyledDiv>
}

export default ExplanationsHeading;
