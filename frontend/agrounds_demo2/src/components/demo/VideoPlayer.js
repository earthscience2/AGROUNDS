import React, { useEffect, useRef } from 'react';
import dashjs from 'dashjs';

const DashPlayer = ({ url }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const player = dashjs.MediaPlayer().create();
    player.initialize(videoRef.current, url, false);

    return () => {
      player.destroy();
    };
  }, [url]);

  return (
    <div style={{maxWidth: '400px', width: '100%', display: 'flex', justifyContent:'center', alignItems: 'center'}}>
      <video
        ref={videoRef}
        controls
        style={{margin: 'auto', width: '90%', maxWidth: '340px', marginTop: '3vh'}}>
      </video>
    </div>
  );
};

export default DashPlayer;
