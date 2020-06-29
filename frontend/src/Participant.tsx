import React from "react";
import { Card, Colors, Elevation } from "@blueprintjs/core";
import VideoFeed from "./VideoFeed";
import ExplanationsContainer from "./ExplanationsContainer";
import styled from "styled-components";
import { DataContainerType } from "./loadEngagementData";
import UserInfo from "./UserInfo";

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

const UserInfoContainer = styled.div`
    position: absolute;
    bottom: 0;
    margin: 0;
`;

const CustomCard = styled(Card)`
  margin-top: 20px;
  flex: 1;
`

class Participant extends React.Component<
    { videoURL: string; name: string; dataContainer: DataContainerType; mode: "bar" | "cloud" },
    { currentTime: number }
> {
    state = { currentTime: 0 };

    onTimeUpdate = (currentTime: number) => this.setState({ currentTime });

    render() {
        const { videoURL, name, dataContainer, mode } = this.props;
        const { currentTime } = this.state;
        const dataPoint = dataContainer?.data[Math.floor(currentTime * dataContainer?.sampleRate)];

        const outputClass = dataPoint ? dataPoint.output.indexOf(Math.max(...dataPoint.output)) : 4;

        return (
            <CustomCard elevation={Elevation.TWO}>
                <ParticipantLayout>
                    <VideoArea>
                        <VideoFeed videoURL={videoURL} onTimeUpdate={this.onTimeUpdate} />
                        <UserInfoContainer>
                            <UserInfo name={name} engagementLevel={outputClass} />
                        </UserInfoContainer>
                    </VideoArea>
                    {dataPoint && (
                        <ExplanationsContainer
                            labels={dataContainer?.labels || []}
                            dataPoint={dataPoint}
                            mode={mode}
                            username={name}
                            maxExplanationValue={dataContainer.maxExplanationValue}
                            minInputValues={dataContainer.minInputs}
                            maxInputValues={dataContainer.maxInputs}
                        />
                    )}
                </ParticipantLayout>
            </CustomCard>
        );
    }
}

export default Participant;
