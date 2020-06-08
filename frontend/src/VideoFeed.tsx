import React from "react";
import styled from "styled-components";

const VideoContainer = styled.div`
    /* TODO: this should probably be passed in from somewhere 
    further up the hierarchy once we have more than one videofeed */

    --video-width: 60vw;

    width: var(--video-width);
    height: calc(var(--video-width) * 0.562); /* 16:9 video */

    position: relative;

    video {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
    }
`;

const Placeholder = styled.h2`
    padding: 40px;
    background: rgba(255, 120, 120, 0.5);
    color: white;
    font-weight: bold;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
`;

function VideoFeed(props: { videoURL: string }) {
    return (
        <VideoContainer>
            <video controls muted autoPlay>
                <source src={props.videoURL} type="video/mp4" />
                Your browser does not support HTML video.
            </video>

            <Placeholder>PLACEHOLDER VIDEO-FEED</Placeholder>
        </VideoContainer>
    );
}

export default VideoFeed;
