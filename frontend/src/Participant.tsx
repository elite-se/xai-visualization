import React from "react";
import { Card, Elevation } from "@blueprintjs/core";
import VideoFeed from "./VideoFeed";
import ExplanationsContainer from "./ExplanationsContainer";
import "./Participant.css";

function Participant(props: any) {
    return (
        <Card elevation={Elevation.TWO}>
            <div className="ParticipantLayout">
                <div className="video-area">
                    <VideoFeed videoURL={props.videoURL}></VideoFeed>
                    <h4 className="name">{props.name}</h4>
                </div>

                <ExplanationsContainer></ExplanationsContainer>
            </div>
        </Card>
    );
}

export default Participant;
