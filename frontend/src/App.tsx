import React, {SyntheticEvent} from "react";
import Participant from "./Participant";

import {
    Button,
    ButtonGroup,
    Icon,
    InputGroup,
    Navbar,
    NavbarDivider,
    NavbarGroup,
    NavbarHeading,
} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import styled from "styled-components";
import loadEngagementData, {DataContainerType} from "./loadEngagementData";
import getHashParams from "./getHashParams";

const Container = styled.div`
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
`;

const Main = styled.main`
    padding: 30px 40px;
`;

const H3 = styled.div`
    margin-left: 6px;
`;

const HorizontalSpacer = styled.div`
    height: 20px;
`;

type ParticipantData = { name: string; videoURL: string; dataURL: string; dataContainer: DataContainerType | null };

type StateType = {
    username: string;
    password: string;
    mode: 'bar' | 'cloud';
    participantsData: ParticipantData[],
    loading: boolean
};

class App extends React.Component<{}, StateType> {
    state: StateType = {
        username: "",
        password: "",
        mode: 'bar',
        loading: false,
        participantsData: []
    };

    getEmptyParticipantsData (): ParticipantData[] {
        const { username, password } = this.state
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
            const participantsData  = this.getEmptyParticipantsData()
            for (let pData of participantsData) {
                pData.dataContainer = await loadEngagementData(this.state.username, this.state.password, pData.dataURL, false);
            }
            this.setState({participantsData});
        } finally {
            this.setState({loading: false})
        }
    };

    renderParticipants = () => {
        let participants = [];
        let i = 0;
        for (let pData of this.state.participantsData) {
            if (pData.dataContainer !== null) {
                participants.push(
                    <Participant
                        key={"p" + i}
                        dataContainer={pData.dataContainer}
                        name={pData.name}
                        videoURL={pData.videoURL}
                        mode={this.state.mode}
                    />
                );
                if (i < this.state.participantsData.length - 1) {
                    participants.push(<HorizontalSpacer key={"s" + i}/>);
                }
            }
            i++;
        }
        return participants;
    };

    render() {
        const {mode, username, password, loading} = this.state
        return (
            <Container>
                <Navbar>
                    <NavbarGroup>
                        <Icon icon={IconNames.FULL_STACKED_CHART} iconSize={Icon.SIZE_LARGE}/>
                        <NavbarHeading>
                            <H3>XAI-Visualisations</H3>
                        </NavbarHeading>
                        <NavbarDivider/>
                        <ButtonGroup>
                            <Button icon="document-open" onClick={() => alert("tbd")}>
                                Open...
                            </Button>
                        </ButtonGroup>
                        <NavbarDivider/>
                        <InputGroup placeholder="Username" onChange={this.onUsernameChange} value={username}/>
                        <InputGroup placeholder="Password" type="password" onChange={this.onPasswordChange}
                                    value={password}/>
                        <Button onClick={this.loadData} loading={loading}>Load data</Button>
                        <NavbarDivider/>
                        <ButtonGroup>
                            <Button active={mode === 'bar'} onClick={() => this.setState({mode: 'bar'})}>Bar
                                charts</Button>
                            <Button active={mode === 'cloud'} onClick={() => this.setState({mode: 'cloud'})}>Word
                                cloud</Button>
                        </ButtonGroup>
                    </NavbarGroup>
                </Navbar>

                <Main>{this.renderParticipants()}</Main>
            </Container>
        );
    }
}

export default App;
