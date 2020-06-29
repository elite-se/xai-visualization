import React from "react";
import {Card, Elevation} from "@blueprintjs/core";
import VideoFeed from "./VideoFeed";
import ExplanationsContainer from "./ExplanationsContainer";
import styled from "styled-components";
import {DataContainerType} from "./loadEngagementData";
import UserInfo from "./UserInfo";


const VideoArea = styled.div`
  position: relative;
  flex: 45;
`;

const UserInfoContainer = styled.div`
    position: absolute;
    bottom: 0;
    margin: 0;
`;

const CustomCard = styled(Card)`
  display: flex;
  margin: 10px 0;
  width: 100%;
  padding: 0;
  overflow: hidden;
  flex: 1;
`

class Participant extends React.Component<{
    videoURL: string; name: string;
    dataContainer: DataContainerType;
    mode: "bar" | "cloud";
    paused: boolean
},
    { currentTime: number }> {
    state = {currentTime: 0};

    onTimeUpdate = (currentTime: number) => {
        this.setState({currentTime});
    }

    render() {
        const {videoURL, name, dataContainer, mode} = this.props;
        const {currentTime} = this.state;
        const dataPoint = dataContainer?.data[Math.floor(currentTime * dataContainer?.sampleRate)];

        const outputClass = dataPoint ? dataPoint.output.indexOf(Math.max(...dataPoint.output)) : 4;

        return (
            <CustomCard elevation={Elevation.TWO}>
                <VideoArea>
                    <VideoFeed videoURL={videoURL} onSeeked={() => {
                    }} onPause={() => {
                    }} onPlay={() => {
                    }} paused={this.props.paused} onTimeUpdate={this.onTimeUpdate}/>
                    <UserInfoContainer>
                        <UserInfo name={name} engagementLevel={outputClass}/>
                    </UserInfoContainer>
                </VideoArea>
                <ExplanationsContainer
                    labels={dataContainer?.labels || []}
                    dataPoint={dataPoint}
                    mode={mode}
                    username={name}
                    maxExplanationValue={dataContainer.maxExplanationValue}
                    minInputValues={dataContainer.minInputs}
                    maxInputValues={dataContainer.maxInputs}
                />
            </CustomCard>
        );
    }
}

export default Participant;
