import React from "react";
import { Card, Elevation, Colors } from "@blueprintjs/core";
import VideoFeed from "./VideoFeed";
import ExplanationsContainer from "./ExplanationsContainer";
import styled from "styled-components";
import loadEngagementData from "./loadEngagementData";

const ParticipantLayout = styled.div`
    width: 100%;
    box-sizing: border-box;
    display: flex;
    border: 1px solid ${Colors.DARK_GRAY4};
`;

const VideoArea = styled.div`
    position: relative;
    border-right: 1px solid ${Colors.GRAY1};
`;

const Name = styled.h4`
    position: absolute;
    bottom: 0;
    padding: 12px 32px 12px 20px;
    background: rgb(34, 34, 34);
    color: white;
    margin: 0;
`;

const dataContainer = loadEngagementData()

class Participant extends React.Component<{ videoURL: string; name: string }, { currentTime: number }> {

    state = { currentTime: 0 }

    onTimeUpdate = (currentTime: number) => this.setState({ currentTime })

    render () {
        const { videoURL, name } = this.props
        const { currentTime } = this.state
        const dataPoint = dataContainer.data[Math.floor(currentTime * dataContainer.sampleRate)]
        return (
            <Card elevation={Elevation.TWO}>
                <ParticipantLayout>
                    <VideoArea>
                        <VideoFeed videoURL={videoURL} onTimeUpdate={this.onTimeUpdate}/>
                        <Name>{name}</Name>
                    </VideoArea>
                    <ExplanationsContainer labels={dataContainer.labels} dataPoint={dataPoint}/>
                </ParticipantLayout>
            </Card>
        );
    }
}

export default Participant;
