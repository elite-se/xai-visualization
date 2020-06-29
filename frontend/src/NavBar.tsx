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
    Slider,
} from "@blueprintjs/core";
import Autocomplete from 'react-autocomplete'
import {IconNames} from "@blueprintjs/icons";
import styled from "styled-components";

const SESSION_IDS = [
    '001_2016-03-17_Paris',
    '002_2016-03-17_Paris',
    '003_2016-03-17_Paris',
    '004_2016-03-18_Paris',
    '005_2016-03-18_Paris',
    '006_2016-03-18_Paris',
    '007_2016-03-21_Paris',
    '008_2016-03-23_Paris',
    '009_2016-03-25_Paris',
    '027_2016-04-06_Nottingham',
    '030_2016-04-06_Nottingham',
    '034_2016-04-07_Nottingham',
    '066_2016-05-23_Augsburg',
    '072_2016-05-23_Augsburg',
    '076_2016-05-24_Augsburg',
]

const H3 = styled.div`
    margin-left: 6px;
`;

const CustomSlider = styled(Slider)`
  width: 100px;
`

type PropsType = {
    username: string;
    password: string;
    sessionId: string;
    mode: 'bar' | 'cloud';
    loading: boolean;
    setUsername: (username: string) => void;
    setPassword: (password: string) => void;
    setSessionId: (sessionId: string) => void;
    setMode: (mode: 'bar' | 'cloud') => void;
    loadData: () => void;
    showDevSettings: boolean,
    paused: boolean,
    volume: number,
    onPause: () => void;
    setVolume: (volume: number) => void
};

class NavBar extends React.Component<PropsType> {
    onUsernameChange = (event: SyntheticEvent<HTMLInputElement>) => this.props.setUsername(event.currentTarget.value)
    onPasswordChange = (event: SyntheticEvent<HTMLInputElement>) => this.props.setPassword(event.currentTarget.value)
    onSessionIdChange = (event: SyntheticEvent<HTMLInputElement>) => this.props.setSessionId(event.currentTarget.value)
    onVolumeChange = (value: number) => this.props.setVolume(value)

    render() {
        const {mode, username, password, loading, showDevSettings, setMode, sessionId, setSessionId, paused, volume} = this.props
        return (
            <Navbar>
                <NavbarGroup>
                    <Icon icon={IconNames.FULL_STACKED_CHART} iconSize={Icon.SIZE_LARGE}/>
                    <NavbarHeading>
                        <H3>XAI-Visualisations</H3>
                    </NavbarHeading>
                    <NavbarDivider/>
                    {showDevSettings && <>
                        <Autocomplete
                            items={SESSION_IDS}
                            shouldItemRender={() => true}
                            getItemValue={(item: string) => item}
                            renderItem={(item: string, highlighted: boolean) =>
                                <div key={item} style={{backgroundColor: highlighted ? '#eee' : 'transparent'}}>
                                    {item}
                                </div>}
                            value={sessionId}
                            onChange={this.onSessionIdChange}
                            renderInput={({ref, ...props}: any) => <InputGroup placeholder='Session Id' {...props}
                                                                               inputRef={ref}/>}
                            onSelect={(id: string) => setSessionId(id)}/>
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
                    <NavbarDivider/>
                    <NavbarGroup>
                        <Button style={{width: 10}} onClick={() => this.props.onPause()}>{!paused ? '⏸' : '▶'}</Button>
                        <Icon style={{ margin: '0 10px 0 20px'}} icon={"volume-up"}/>
                        <CustomSlider min={0} max={1} labelRenderer={false} stepSize={0.01}
                                value={volume} onChange={this.onVolumeChange}/>
                    </NavbarGroup>
                </NavbarGroup>
            </Navbar>
        );
    }
}

export default NavBar;
