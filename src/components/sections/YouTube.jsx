import { useState, useEffect, useRef } from 'react';
import AtmosphericEffects from '../effects/AtmosphericEffects';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import './YouTube.css';

const YouTube = ({ config }) => {
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const carouselRef = useRef(null);

  const channelId = config.youtube?.channel_id;
  const channelUrl = config.youtube?.channel_url;
  const apiKey = config.youtube?.api_key; // Optional: for real YouTube API integration

  useEffect(() => {
    // Build videos array from config
    const videoList = [];

    // Add featured video if configured
    if (config.youtube?.featured_video_id) {
      videoList.push({
        id: config.youtube.featured_video_id,
        title: config.youtube.featured_video_title || 'Featured Video',
        thumbnail: `https://img.youtube.com/vi/${config.youtube.featured_video_id}/hqdefault.jpg`
      });
    }

    // Add suggested videos if configured
    if (config.youtube?.suggested_videos && config.youtube.suggested_videos.length > 0) {
      videoList.push(...config.youtube.suggested_videos.map(video => ({
        id: video.video_id,
        title: video.title,
        thumbnail: `https://img.youtube.com/vi/${video.video_id}/hqdefault.jpg`
      })));
    }

    setVideos(videoList);
    setLoading(false);
  }, [config.youtube]);

  // Don't render if no channel is configured
  if (!channelId && !channelUrl) {
    return null;
  }

  // Don't render if no videos are configured
  if (!config.youtube?.featured_video_id && (!config.youtube?.suggested_videos || config.youtube.suggested_videos.length === 0)) {
    return null;
  }

  const currentVideo = videos[currentVideoIndex] || {};
  const embedUrl = `https://www.youtube.com/embed/${currentVideo.id}?autoplay=0&rel=0`;

  const scrollToVideo = (index) => {
    setCurrentVideoIndex(index);
    if (carouselRef.current) {
      const videoCards = carouselRef.current.children;
      if (videoCards[index]) {
        videoCards[index].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center'
        });
      }
    }
  };

  const handlePrevVideo = () => {
    if (videos.length === 0) return;
    const newIndex = currentVideoIndex > 0 ? currentVideoIndex - 1 : videos.length - 1;
    scrollToVideo(newIndex);
  };

  const handleNextVideo = () => {
    if (videos.length === 0) return;
    const newIndex = currentVideoIndex < videos.length - 1 ? currentVideoIndex + 1 : 0;
    scrollToVideo(newIndex);
  };

  if (loading || videos.length === 0) {
    return null;
  }

  return (
    <section className="youtube-section">
      <AtmosphericEffects />
      <div className="youtube-container">
        <FadeIn>
          <h2 className="section-title">YouTube Channel</h2>
          <p className="youtube-subtitle">
            Latest videos and tutorials on AI, cloud automation, and software engineering
          </p>
        </FadeIn>

        <div className="youtube-content">
          {/* Main Video Player */}
          <SlideIn direction="up" delay={0.2}>
            <div className="main-video-wrapper">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentVideo.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="video-container"
                >
                  <iframe
                    src={embedUrl}
                    title={currentVideo.title || 'YouTube video player'}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="video-iframe"
                  ></iframe>
                </motion.div>
              </AnimatePresence>
            </div>
          </SlideIn>

          {/* Video Carousel */}
          {videos.length > 1 && (
            <SlideIn direction="up" delay={0.4}>
              <div className="video-carousel-section">
                <div className="carousel-header">
                  <h3 className="carousel-title">More Videos</h3>
                  <div className="carousel-controls">
                    <button
                      className="carousel-button"
                      onClick={handlePrevVideo}
                      aria-label="Previous video"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6" />
                      </svg>
                    </button>
                    <button
                      className="carousel-button"
                      onClick={handleNextVideo}
                      aria-label="Next video"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="video-carousel" ref={carouselRef}>
                  {videos.map((video, index) => (
                    <motion.div
                      key={video.id}
                      className={`video-card ${index === currentVideoIndex ? 'active' : ''}`}
                      onClick={() => scrollToVideo(index)}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="video-thumbnail">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          onError={(e) => {
                            e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'%3E%3Crect fill='%23262626' width='320' height='180'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23666' font-family='monospace' font-size='14'%3EVideo ${index + 1}%3C/text%3E%3C/svg%3E`;
                          }}
                        />
                        <div className="play-overlay">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="video-card-info">
                        <h4 className="video-card-title">{video.title}</h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </SlideIn>
          )}

          {/* Channel CTA */}
          {channelUrl && (
            <FadeIn delay={0.6}>
              <div className="channel-cta-wrapper">
                <a
                  href={channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="subscribe-button"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                  Subscribe for More Content
                </a>
              </div>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
};

export default YouTube;
