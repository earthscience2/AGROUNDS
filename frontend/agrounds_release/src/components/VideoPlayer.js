import React, { useEffect, useRef } from 'react';
import dashjs from 'dashjs';

const VideoPlayer = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = dashjs.MediaPlayer().create();
    player.initialize(videoRef.current, url, false);

    return () => {
      player.destroy();
    };
  }, [url]);

  return (
    <div style={{maxWidth: '500px', height: 'maxContent', width: '100%', display: 'flex', justifyContent:'center', alignItems: 'center'}}>
      <video
        ref={videoRef}
        controls
        style={{margin: 'auto', width: '100%', maxWidth: '500px'}}>
      </video>
    </div>
  );
};

export default VideoPlayer;
