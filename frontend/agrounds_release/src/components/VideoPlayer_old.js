// import React from 'react';
// import YouTube from 'react-youtube';

// const VideoPlayer = ({ url, height='390', width='640' }) => {
//   // YouTube URL에서 비디오 ID 추출
//   const getVideoId = (url) => {
//     const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
//     const match = url.match(regExp);
//     return (match && match[2].length === 11) ? match[2] : null;
//   };

//   const videoId = getVideoId(url);

//   const opts = {
//     height: height,
//     width: width,
//     playerVars: {
//       autoplay: 0,
//     },
//   };

//   return (
//     <div style={{maxWidth: '500px', height: 'maxContent', width: '100%', display: 'flex', justifyContent:'center', alignItems: 'center'}}>
//       {videoId ? (
//         <YouTube
//           videoId={videoId}
//           opts={opts}
//           style={{margin: 'auto', width: '100%', maxWidth: '500px'}}
//         />
//       ) : (
//         <p>유효하지 않은 YouTube URL입니다.</p>
//       )}
//     </div>
//   );
// };

// export default VideoPlayer;
