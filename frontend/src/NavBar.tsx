import React, {SyntheticEvent} from "react";

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

const H3 = styled.div`
    margin-left: 6px;
`;

type PropsType = {
    username: string;
    password: string;
    mode: 'bar' | 'cloud';
    loading: boolean;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    setMode: (mode: 'bar' | 'cloud') => void;
    loadData: () => void;
    showDevSettings: boolean
};

class NavBar extends React.Component<PropsType> {
    onUsernameChange = (event: SyntheticEvent<HTMLInputElement>) => this.props.setUsername(event.currentTarget.value)
    onPasswordChange = (event: SyntheticEvent<HTMLInputElement>) => this.props.setPassword(event.currentTarget.value)

    render() {
        const {mode, username, password, loading, showDevSettings, setMode} = this.props
        return (
            <Navbar>
                <NavbarGroup>
                    <Icon icon={IconNames.FULL_STACKED_CHART} iconSize={Icon.SIZE_LARGE}/>
                    <NavbarHeading>
                        <H3>XAI-Visualisations</H3>
                    </NavbarHeading>
                    <NavbarDivider/>
                    {showDevSettings && <>
                        <ButtonGroup>
                            <Button icon="document-open" onClick={() => alert("tbd")}>
                                Open...
                            </Button>
                        </ButtonGroup>
                        <NavbarDivider/>
                        <InputGroup placeholder="Username" onChange={this.onUsernameChange} value={username}/>
                        <InputGroup placeholder="Password" type="password" onChange={this.onPasswordChange}
                                    value={password}/>
                        <Button onClick={this.props.loadData} loading={loading}>Load data</Button>
                        <NavbarDivider/>
                    </>}
                    <ButtonGroup>
                        <Button active={mode === 'bar'} onClick={() => setMode('bar')}>Bar charts</Button>
                        <Button active={mode === 'cloud'} onClick={() => setMode('cloud')}>Word cloud</Button>
                    </ButtonGroup>
                </NavbarGroup>
            </Navbar>
        );
    }
}

export default NavBar;
