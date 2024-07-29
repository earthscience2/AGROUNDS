import React from 'react';
import styled from 'styled-components';

const Video = () => {
    return (
        <VideoStyle>
            <video autoPlay>
                <source src="https://d3lgojruk6udwb.cloudfront.net/vod/mp4/3.mp4" type="video/mp4" />
            </video>
        </VideoStyle>
    );
};

export default Video;

const VideoStyle = styled.div`
    width: 100vw;
    height: 100vh;
    video{
        width: 100vw;

    }

`