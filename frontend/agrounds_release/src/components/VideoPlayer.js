import React from 'react';
import YouTubeLogo from '../assets/youtube.svg'; // SVG 경로 확인 필수

const VideoPlayer = ({ url, height = '390', width = '640' }) => {
  const extractYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:.*[?&]v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = extractYouTubeID(url);
  if (!videoId) return <p>유효하지 않은 유튜브 URL입니다.</p>;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  function getPlatform() {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(ua)) return "android";
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "ios";
    return "desktop";
  }

  const handleClick = () => {
    const platform = getPlatform();
    const videoId = extractYouTubeID(url);
    const webUrl = `https://www.youtube.com/watch?v=${videoId}`;
    let appUrl;
  
    if (platform === "android") {
      appUrl = `vnd.youtube://${videoId}`;
    } else if (platform === "ios") {
      appUrl = `youtube://watch?v=${videoId}`;
    } else {
      // ✅ 데스크탑은 팝업 차단 없이 바로 열기
      window.open(webUrl, "_blank");
      return;
    }
  
    // 앱 실행 시도
    window.location.href = appUrl;
  
    // fallback: 앱이 열리지 않으면 1.5초 후 새 탭에 YouTube 웹 열기
    setTimeout(() => {
      // 새 창이 막혔거나 닫혔으면 현재 탭에서 fallback
      window.location.href = webUrl;
    }, 1500);
  };
  
  

  return (
    <div
      onClick={handleClick}
      style={{
        marginTop: "4px",
        cursor: "pointer",
        width: "99vw",
        maxWidth: "500px",
        aspectRatio: "16/9",
        backgroundImage: `url(${thumbnailUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "12px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* YouTube 로고 오버레이 */}
      <img
        src={YouTubeLogo}
        alt="Play YouTube Video"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "64px",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
