import React, {SyntheticEvent} from "react";
import styled from "styled-components";

const StyledVideo = styled.video`
    height: 100%;
    width: 100%;
    object-fit: cover;
`;

type PropsType = {
    videoURL: string; onTimeUpdate: (t: number) => void,
    paused: boolean,
    volume: number,
    onPlay: () => void, onPause: () => void, onSeeked: (t: number) => void
}

class VideoFeed extends React.Component<PropsType> {
    videoRef: React.RefObject<HTMLVideoElement>

    constructor(props: PropsType) {
        super(props);
        this.videoRef = React.createRef<HTMLVideoElement>();
    }

    componentDidUpdate(prevProps: PropsType) {
        if (this.props.paused !== prevProps.paused || this.props.volume !== prevProps.volume) {
            if (this.videoRef.current) {
                this.videoRef.current.volume = this.props.volume
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
        return <StyledVideo ref={this.videoRef} autoPlay onTimeUpdate={this.onTimeUpdate}
                            onSeeked={this.onSeeked} onPlay={this.props.onPlay} onPause={this.props.onPause}>
            <source src={this.props.videoURL} type="video/mp4"/>
            Your browser does not support HTML video.
        </StyledVideo>
    }
}

export default VideoFeed;
