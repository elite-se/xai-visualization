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
    NavbarHeading
} from "@blueprintjs/core";
import {IconNames} from "@blueprintjs/icons";
import styled from "styled-components";
import loadEngagementData, {DataContainerType} from "./loadEngagementData";

const Container = styled.div`
    min-height: 100vh;
    width: 100%;
    box-sizing: border-box;
`;

const Main = styled.main`
    padding: 40px;
`;

const H3 = styled.div`
    margin-left: 6px;
`;

type StateType = { username: string, password: string, dataContainer: DataContainerType | null}

class App extends React.Component<{}, StateType> {
    state: StateType = { username: '', password: '', dataContainer: null}

    onUsernameChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.setState({ username: event.currentTarget.value })
    }
    onPasswordChange = (event: SyntheticEvent<HTMLInputElement>) => {
        this.setState({ password: event.currentTarget.value })
    }
    loadData = async () => {
        const dataContainer = await loadEngagementData(this.state.username, this.state.password)
        this.setState({dataContainer})
    }

    renderParticipant = () => {
        const { dataContainer } = this.state
        if (dataContainer !== null) {
            return <Participant
                dataContainer={dataContainer}
                name="John Doe"
                videoURL="https://xn--ls8h.maxammann.org/001_2016-03-17_Paris/expert.video.mp4"
            />
        }
        return null
    }

    render() {
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
                            <Button icon='document-open' onClick={() => alert('tbd')}>Open...</Button>
                        </ButtonGroup>
                        <NavbarDivider/>
                        <InputGroup placeholder='Username' onChange={this.onUsernameChange}/>
                        <InputGroup placeholder='Password' onChange={this.onPasswordChange}/>
                        <Button onClick={this.loadData}>Load data!</Button>
                    </NavbarGroup>
                </Navbar>

                <Main>
                    {this.renderParticipant()}
                </Main>
            </Container>
        );
    }
}

export default App;
