import React, {RefObject, SyntheticEvent} from "react";
import styled from "styled-components";
import {DataContainerType} from "./loadEngagementData";

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

type PropsType = { videoURL: string; onTimeUpdate: (t: number) => void,
    paused?: boolean,
    onPlay: () => void, onPause: () => void, onSeeked: (t: number) => void }

class VideoFeed  extends React.Component<PropsType> {
    videoRef: React.RefObject<HTMLVideoElement>
    constructor (props: PropsType) {
        super(props);
        this.videoRef = React.createRef<HTMLVideoElement>();
    }

    componentDidUpdate(prevProps: PropsType) {
        if (this.props.paused !== prevProps.paused) {
            if (this.videoRef.current) {
                if (this.props.paused) {
                    this.videoRef.current.pause();
                } else {
                    this.videoRef.current.play();
                }
            }
        }
    }

    onTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) =>
        this.props.onTimeUpdate(event.currentTarget.currentTime);

    onSeeked = (event: SyntheticEvent<HTMLVideoElement>) =>
        this.props.onSeeked(event.currentTarget.currentTime);

    render() {
        return (
            <VideoContainer>
                <video controls muted autoPlay onTimeUpdate={this.onTimeUpdate} onSeeked={this.onSeeked} onPlay={this.props.onPlay} onPause={this.props.onPause}>
                    <source src={this.props.videoURL} type="video/mp4" />
                    Your browser does not support HTML video.
                </video>
            </VideoContainer>
        );
    }
}

export default VideoFeed;
