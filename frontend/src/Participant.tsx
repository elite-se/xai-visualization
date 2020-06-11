import React from "react";
import { Card, Elevation, Colors } from "@blueprintjs/core";
import VideoFeed from "./VideoFeed";
import ExplanationsContainer from "./ExplanationsContainer";
import styled from "styled-components";
import loadEngagementData, {DataContainerType} from "./loadEngagementData";
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

class Participant extends React.Component<{ videoURL: string; name: string }, { currentTime: number, loaded: boolean }> {
    state = { currentTime: 0, loaded: false };
    private dataContainer: DataContainerType | null = null;

    async componentDidMount () {
        this.dataContainer = await loadEngagementData()
        this.setState({ loaded: true })
    }

    onTimeUpdate = (currentTime: number) => this.setState({ currentTime });

    render() {
        const { videoURL } = this.props;
        const { currentTime } = this.state;
        const dataPoint = this.dataContainer?.data[Math.floor(currentTime * this.dataContainer?.sampleRate)];

        const outputClass = dataPoint ? dataPoint.output.indexOf(Math.max(...dataPoint.output)) : 4;

        return (
            <Card elevation={Elevation.TWO}>
                <ParticipantLayout>
                    <VideoArea>
                        <VideoFeed videoURL={videoURL} onTimeUpdate={this.onTimeUpdate} />
                        <UserInfoContainer>
                            <UserInfo name={"John Doe"} engagementLevel={outputClass}/>
                        </UserInfoContainer>
                    </VideoArea>
                    {dataPoint && <ExplanationsContainer labels={this.dataContainer?.labels || []} dataPoint={dataPoint} />}
                </ParticipantLayout>
            </Card>
        );
    }
}

export default Participant;
