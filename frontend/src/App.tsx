import React from "react";
import Participant from "./Participant";

import { Icon, Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";
import styled from "styled-components";

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

function App() {
    return (
        <Container>
            <Navbar>
                <NavbarGroup>
                    <Icon icon={IconNames.FULL_STACKED_CHART} iconSize={Icon.SIZE_LARGE} />
                    <NavbarHeading>
                        <H3>XAI-Visualisations</H3>
                    </NavbarHeading>
                </NavbarGroup>
            </Navbar>

            <Main>
                <Participant
                    name="John Doe"
                    videoURL="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                />
            </Main>
        </Container>
    );
}

export default App;
