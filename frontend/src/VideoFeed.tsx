import React, { SyntheticEvent } from "react";
import styled from "styled-components";

const VideoContainer = styled.div`
    /* TODO: this should probably be passed in from somewhere 
    further up the hierarchy once we have more than one videofeed */

    --video-width: 65vw;

    /* "viewport" dimensions, i.e. what we see of the video */
    width: 40vw;
    height: calc(var(--video-width) * 0.45);

    position: relative;
    overflow: hidden;

    video {
        position: absolute;
        bottom: 0;
        left: 0;
        width: var(--video-width);
        height: calc(var(--video-width) * 0.562); /* maintain 16:9 aspect ratio of the video */
        transform: translateX(-20%);
    }
`;

function VideoFeed(props: { videoURL: string; onTimeUpdate: (t: number) => void }) {
    const onTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) =>
        props.onTimeUpdate(event.currentTarget.currentTime);

    return (
        <VideoContainer>
            <video muted autoPlay onTimeUpdate={onTimeUpdate}>
                <source src={props.videoURL} type="video/mp4" />
                Your browser does not support HTML video.
            </video>
        </VideoContainer>
    );
}

export default VideoFeed;
