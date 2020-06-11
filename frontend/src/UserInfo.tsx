import React from "react";
import styled from "styled-components";
import EngagementLevelIndicator from "./EngagementLevelIndicator";
import { Colors } from "@blueprintjs/core";

const InfoContainer = styled.div`
    display: flex;
    align-items: center;
    background: ${Colors.DARK_GRAY2};
`;

const Name = styled.h4`
    padding: 12px 32px 12px 20px;
    color: white;
    margin: 0;
    border-right: 1px solid ${Colors.GRAY1};
`;

function UserInfo(props: { name: string; engagementLevel: number }) {
    return (
        <InfoContainer>
            <Name>{props.name}</Name>
            <EngagementLevelIndicator engagementLevel={props.engagementLevel}/>
        </InfoContainer>
    );
}

export default UserInfo;
