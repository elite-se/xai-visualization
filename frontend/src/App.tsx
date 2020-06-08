import React from "react";
import "./App.css";
import Participant from "./Participant";

import { Navbar, NavbarGroup, NavbarHeading, Icon } from "@blueprintjs/core";
import { IconNames } from "@blueprintjs/icons";

function App() {
    return (
        <div className="App">
            <Navbar>
                <NavbarGroup>
                    <Icon icon={IconNames.FULL_STACKED_CHART} iconSize={Icon.SIZE_LARGE} />
                    <NavbarHeading>
                        <h3 className="title">XAI-Visualisations</h3>
                    </NavbarHeading>
                </NavbarGroup>
            </Navbar>

            <main>
                <Participant
                    name="John Doe"
                    videoURL="https://ia800300.us.archive.org/17/items/BigBuckBunny_124/Content%2Fbig_buck_bunny_720p_surround.mp4"
                ></Participant>
            </main>
        </div>
    );
}

export default App;
