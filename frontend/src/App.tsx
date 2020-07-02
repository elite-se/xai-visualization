import React from "react";
import Participant from "./Participant";
import styled from "styled-components";
import loadEngagementData, { DataContainerType } from "./loadEngagementData";
import getHashParams from "./getHashParams";
import NavBar from "./NavBar";
import { Card, Spinner } from "@blueprintjs/core";
import { genders } from "./genderData";
import { Gender } from "./FeaturesToTextMapping";

const Container = styled.div`
    display: flex;
    height: 100vh;
    width: 100%;
    box-sizing: border-box;
    flex-direction: column;
`;

const Main = styled.main`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;
    padding: 0 40px;
    background-color: #eee;
    overflow: hidden;
`;

type ParticipantData = {
    name: string;
    gender: Gender;
    videoURL: string;
    dataURL: string;
    dataContainer: DataContainerType | null;
};

type StateType = {
    username: string;
    password: string;
    sessionId: string;
    mode: 'bar' | 'cloud';
    participantsData: ParticipantData[],
    discreteParticipantsData: ParticipantData[],
    loading: boolean,
    error: Error | null,
    paused: boolean,
    showDevSettings: boolean,
    volume: number
};

class App extends React.Component<{}, StateType> {
    state: StateType = {
        username: "",
        password: "",
        sessionId: "008_2016-03-23_Paris",
        mode: "bar",
        loading: false,
        participantsData: [],
        discreteParticipantsData: [],
        error: null,
        paused: true,
        showDevSettings: true,
        volume: 1
    };

    getEmptyParticipantsData(): ParticipantData[] {
        const { username, password, sessionId } = this.state;
        return [
            {
                name: genders[sessionId].expert.name,
                gender: genders[sessionId].expert.gender,
                videoURL: `https://${username}:${password}@xai.elite-se.xyz/noxi-dataset/${sessionId}/expert.video.mp4`,
                dataURL: `https://xai.elite-se.xyz/noxi-dataset/${sessionId}-expert.json`,
                dataContainer: null,
            },
            {
                name: genders[sessionId].novice.name,
                gender: genders[sessionId].novice.gender,
                videoURL: `https://${username}:${password}@xai.elite-se.xyz/noxi-dataset/${sessionId}/novice.video.mp4`,
                dataURL: `https://xai.elite-se.xyz/noxi-dataset/${sessionId}-novice.json`,
                dataContainer: null,
            },
        ];
    }

    componentDidMount() {
        if (window.location.hash) {
            try {
                const { username, password, sessionId } = getHashParams()
                const newState: any = { username, password, showDevSettings: false }
                if (sessionId) newState.sessionId = sessionId
                this.setState(newState, this.loadData)
            } catch {
                console.error("Could not parse hash params.");
            }
        }
    }

    loadData = async () => {
        this.setState({ loading: true });
        try {
            const participantsData = this.getEmptyParticipantsData();
            const discretePartData = this.getEmptyParticipantsData();
            for (let i = 0; i < participantsData.length; i++) {
                let engagementData = await loadEngagementData(
                    this.state.username,
                    this.state.password,
                    participantsData[i].dataURL,
                    false
                );
                participantsData[i].dataContainer = engagementData[0];
                discretePartData[i].dataContainer = engagementData[1];
            }
            this.setState({ participantsData });
            this.setState({ discreteParticipantsData: discretePartData });
        } catch (error) {
            this.setState({ error });
        } finally {
            this.setState({ loading: false });
        }
    };

    handleLoadDataButton = async () => {
        const { username, password, sessionId } = this.state
        window.location.hash = `#username=${username}&password=${password}&sessionId=${sessionId}`
        await this.loadData()
    }

    renderParticipants = () => {
        return this.state.participantsData
            .map((item, index) =>
                item.dataContainer !== null && this.state.discreteParticipantsData[index].dataContainer !== null
                ? <Participant key={"p" + index} dataContainer={item.dataContainer}
                    discreteContainer={this.state.discreteParticipantsData[index].dataContainer as DataContainerType }
                    name={item.name} gender={item.gender}
                    volume={this.state.volume}
                    videoURL={item.videoURL} mode={this.state.mode} paused={this.state.paused} />
                : null)
            .filter(item => !!item)
    };

    render() {
        const { mode, username, password, loading, error, sessionId, showDevSettings, volume, paused } = this.state
        return <Container>
            <NavBar username={username} password={password} mode={mode} loading={loading} sessionId={sessionId}
                setUsername={username => this.setState({ username })}
                setPassword={password => this.setState({ password })}
                setSessionId={sessionId => this.setState({ sessionId })}
                setMode={mode => this.setState({ mode })}
                loadData={this.handleLoadDataButton}
                showDevSettings={showDevSettings}
                paused={paused}
                volume={volume}
                setVolume={(volume: number) => this.setState({ volume })}
                onPause={() => this.setState(({ paused }) => ({ paused: !paused }))} />
            <Main>{loading
                ? <Spinner />
                : error ? <Card>Some error occurred: {error.message}</Card> : this.renderParticipants()}</Main>
        </Container>
    }
}

export default App;
