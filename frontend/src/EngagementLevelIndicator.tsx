import React from "react";
import styled from "styled-components";
import { Colors } from "@blueprintjs/core";

const ENGAGEMENT_COLORS = [Colors.RED3, Colors.ORANGE3, Colors.BLUE3, Colors.GREEN3]; //assuming 0 is low engagement

const Indicator = styled.div`
    width: 24px;
    height: 24px;
    border-radius: 24px;
    margin: 0 10px;
    box-sizing: border-box;
`;

function EngagementLevelIndicator(props: any) {
    return <Indicator style={{ background: ENGAGEMENT_COLORS[props.engagementLevel] }}></Indicator>;
}

export default EngagementLevelIndicator;
