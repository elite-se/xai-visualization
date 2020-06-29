import React, {SyntheticEvent} from "react";
import Participant from "./Participant";
import styled from "styled-components";
import loadEngagementData, {DataContainerType} from "./loadEngagementData";
import getHashParams from "./getHashParams";
import NavBar from "./NavBar";
import {Card, Spinner} from "@blueprintjs/core";

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
`;

type ParticipantData = { name: string; videoURL: string; dataURL: string; dataContainer: DataContainerType | null };

type StateType = {
    username: string;
    password: string;
    mode: 'bar' | 'cloud';
    participantsData: ParticipantData[],
    loading: boolean,
    error: Error | null
};

class App extends React.Component<{}, StateType> {
    state: StateType = {
        username: "",
        password: "",
        mode: 'bar',
        loading: false,
        participantsData: [],
        error: null
    };

    getEmptyParticipantsData(): ParticipantData[] {
        const {username, password} = this.state
        return [
            {
                name: "Ian Jackson",
                videoURL: `https://${username}:${password}@xn--ls8h.maxammann.org/001_2016-03-17_Paris/expert.video.mp4`,
                dataURL: "https://xn--ls8h.maxammann.org/001_2016-03-17_Paris-expert.json",
                dataContainer: null
            },
            {
                name: "Allister McCrane",
                videoURL: `https://${username}:${password}@xn--ls8h.maxammann.org/001_2016-03-17_Paris/novice.video.mp4`,
                dataURL: "https://xn--ls8h.maxammann.org/001_2016-03-17_Paris-novice.json",
                dataContainer: null
            }
        ]
    }

    componentDidMount() {
        if (window.location.hash) {
            try {
                const {username, password} = getHashParams()
                this.setState({username, password}, this.loadData)
            } catch {
                console.error('Could not parse hash params.')
            }
        }
    }

    onUsernameChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.setState({username: event.currentTarget.value});
    };

    onPasswordChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.setState({password: event.currentTarget.value});
    };

    loadData = async () => {
        this.setState({loading: true})
        try {
            const participantsData = this.getEmptyParticipantsData()
            for (let pData of participantsData) {
                pData.dataContainer = await loadEngagementData(this.state.username, this.state.password, pData.dataURL, false);
            }
            this.setState({participantsData});
        } catch (error) {
            this.setState({error})
        } finally {
            this.setState({loading: false})
        }
    };

    onTimeUpdate = (currentTime: number) => {

    }

    renderParticipants = () => {
        return this.state.participantsData
            .map((item, index) => item.dataContainer !== null
                ? <Participant key={"p" + index} dataContainer={item.dataContainer} name={item.name}
                               videoURL={item.videoURL} mode={this.state.mode} onTimeUpdate={this.onTimeUpdate}/>
                : null)
            .filter(item => !!item)
    };

    render() {
        const {mode, username, password, loading, error} = this.state
        return <Container>
            <NavBar username={username} password={password} mode={mode} loading={loading}
                    setUsername={username => this.setState({username})}
                    setPassword={password => this.setState({password})}
                    setMode={mode => this.setState({mode})}
                    loadData={this.loadData}
                    showDevSettings={!window.location.hash}/>
            <Main>{loading
                ? <Spinner />
                : error ? <Card>Some error occurred: ${error.message}</Card> : this.renderParticipants()}</Main>
        </Container>
    }
}

export default App;
