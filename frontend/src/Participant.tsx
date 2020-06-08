import React from "react";
import {Card, Elevation} from "@blueprintjs/core";
import VideoFeed from "./VideoFeed";
import ExplanationsContainer from "./ExplanationsContainer";
import styled from "styled-components";

const ParticipantLayout = styled.div`
    width: 100%;
    box-sizing: border-box;

    display: flex;
`

const VideoArea = styled.div`
   position: relative;
`

const Name = styled.h4`
    position: absolute;
    bottom: 0;
    padding: 12px 32px 12px 20px;
    background: rgb(34, 34, 34);
    color: white;
    margin: 0;
`

function Participant(props: { videoURL: string, name: string }) {
    return (
        <Card elevation={Elevation.TWO}>
            <ParticipantLayout>
                <VideoArea>
                    <VideoFeed videoURL={props.videoURL}/>
                    <Name>{props.name}</Name>
                </VideoArea>
                <ExplanationsContainer/>
            </ParticipantLayout>
        </Card>
    );
}

export default Participant;
