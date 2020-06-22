import React from "react";
import styled from "styled-components";
import { Colors } from "@blueprintjs/core";
import { ENGAGEMENT_COLORS } from "./EngagementDefinitions";

const UNKNOWN_COLOR = Colors.BLACK;

const Indicator = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 24px;
    margin: 0 10px;
    box-sizing: border-box;
`;

function EngagementLevelIndicator(props: { engagementLevel: number }) {
    return (
        <Indicator
            style={{
                background: props.engagementLevel === -1 ? UNKNOWN_COLOR : ENGAGEMENT_COLORS[props.engagementLevel],
            }}
        />
    );
}

export default EngagementLevelIndicator;
