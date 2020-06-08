import React from "react";
import "./VideoFeed.css";

function VideoFeed(props: any) {
    return (
        <div className="VideoFeed">
            <video controls muted autoPlay>
                <source src={props.videoURL} type="video/mp4"></source>
                Your browser does not support HTML video.
            </video>

            <h2 className="placeholder">VIDEO FEED</h2>
        </div>
    );
}

export default VideoFeed;
