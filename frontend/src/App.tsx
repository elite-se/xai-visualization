import React from "react";
import "./App.css";
import Participant from "./Participant";

import { Navbar, NavbarGroup, NavbarHeading } from "@blueprintjs/core";

function App() {
    return (
        <div className="App">
            <Navbar>
                <NavbarGroup>
                    <NavbarHeading>XAI-Visualisations</NavbarHeading>
                </NavbarGroup>
            </Navbar>

            <main>
                <Participant name="John Doe"></Participant>
            </main>
        </div>
    );
}

export default App;
