import React, { useMemo, useRef, useEffect } from 'react';
import YouTubeLogo from '../assets/youtube.svg'; // SVG 경로 확인 필수

const VideoPlayer = ({ url, height = '390', width = '640' }) => {
  // 유튜브 ID 추출 함수
  const extractYouTubeID = (url) => {
    const regex = /(?:youtube\.com\/(?:.*[?&]v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = useMemo(() => extractYouTubeID(url), [url]);
  const timeoutRef = useRef(null);

  useEffect(() => {
    const clearAppRedirect = () => clearTimeout(timeoutRef.current);
    window.addEventListener("pagehide", clearAppRedirect);
    return () => window.removeEventListener("pagehide", clearAppRedirect);
  }, []);

  if (!videoId) return <p>유효하지 않은 유튜브 URL입니다.</p>;

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  // 플랫폼 구분
  const getPlatform = () => {
    const ua = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(ua)) return "android";
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "ios";
    return "desktop";
  };

  const handleClick = () => {
    const platform = getPlatform();
    const webUrl = `https://www.youtube.com/watch?v=${videoId}`;
    let appUrl;

    if (platform === "android") {
      appUrl = `vnd.youtube://${videoId}`;
    } else if (platform === "ios") {
      appUrl = `youtube://watch?v=${videoId}`; // iOS용 안전한 포맷
    } else {
      window.open(webUrl, "_blank");
      return;
    }

    window.location.href = appUrl;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter") handleClick();
      }}
      style={{
        marginTop: "4px",
        cursor: "pointer",
        width: "99vw",
        maxWidth: width,
        aspectRatio: "16/9",
        backgroundImage: `url(${thumbnailUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderRadius: "12px",
        position: "relative",
        overflow: "hidden",
        outline: "none",
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
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default VideoPlayer;
