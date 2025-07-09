import React from 'react';

const VideoBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      <iframe
        className="absolute inset-0 w-full h-full object-cover scale-110 blur-sm"
        src="https://www.youtube.com/embed/Z8jmQ_c-iDE?autoplay=1&mute=1&loop=1&playlist=Z8jmQ_c-iDE&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&start=3139"
        title="Ocean Background"
        frameBorder="0"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          pointerEvents: 'none',
          filter: 'blur(3px) brightness(0.7)',
        }}
      />
    </div>
  );
};

export default VideoBackground;