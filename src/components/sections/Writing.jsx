import { useState, useEffect } from 'react';
import AtmosphericEffects from '../effects/AtmosphericEffects';
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';
import './Writing.css';

const Writing = ({ config }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const hashnodeHost = config.writing?.hashnode_host;
  const hashnodeUrl = config.writing?.hashnode_url;

  useEffect(() => {
    if (!hashnodeHost) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        // Use proxy in development, direct API in production
        const apiUrl = import.meta.env.DEV ? '/api/hashnode' : 'https://gql.hashnode.com';

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
              query Publication {
                publication(host: "${hashnodeHost}") {
                  posts(first: 4) {
                    edges {
                      node {
                        id
                        title
                        brief
                        coverImage {
                          url
                        }
                        publishedAt
                        url
                      }
                    }
                  }
                }
              }
            `,
          }),
        });

        const data = await response.json();

        if (data.errors) {
          throw new Error(data.errors[0].message);
        }

        const fetchedPosts = data.data?.publication?.posts?.edges?.map(edge => edge.node) || [];
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching Hashnode posts:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [hashnodeHost]);

  if (!hashnodeHost) {
    return null;
  }

  if (loading) {
    return (
      <section className="writing-section">
      <AtmosphericEffects />
        <div className="writing-container">
          <h2 className="section-title">Blogs</h2>
          <p className="loading-text">Loading articles...</p>
        </div>
      </section>
    );
  }

  // Fallback to static blog data if API fails or returns no posts
  if (error || posts.length === 0) {
    const staticPosts = config.writing?.posts || [];

    if (staticPosts.length === 0) {
      return (
        <section className="writing-section">
          <AtmosphericEffects />
          <div className="writing-container">
            <FadeIn>
              <h2 className="section-title">Blogs</h2>
              <p className="certifications-subtitle">
                Check out my technical blog where I share insights on AI, cloud automation, and software engineering
              </p>
            </FadeIn>

            {hashnodeUrl && (
              <FadeIn delay={0.2}>
                <div className="blog-cta-wrapper" style={{ marginTop: 'var(--spacing-3xl)' }}>
                  <a
                    href={hashnodeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hero-cta hero-cta-primary"
                    style={{ display: 'inline-flex', margin: '0 auto' }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 337 337"
                      fill="currentColor"
                    >
                      <path d="M23.155 112.598c-30.873 30.873-30.873 80.929 0 111.802l89.443 89.443c30.873 30.873 80.929 30.873 111.802 0l89.443-89.443c30.873-30.873 30.873-80.929 0-111.802l-89.443-89.443c-30.873-30.873-80.929-30.873-111.802 0z" />
                      <path fill="var(--color-bg-primary)" d="M149.99 139.45c21.773-21.773 57.027-21.773 78.8 0 21.773 21.773 21.773 57.027 0 78.8-21.773 21.773-57.027 21.773-78.8 0-21.773-21.773-21.773-57.027 0-78.8z" />
                    </svg>
                    Visit My Hashnode Blog
                  </a>
                </div>
              </FadeIn>
            )}
          </div>
        </section>
      );
    }

    // Use static posts
    return (
      <section className="writing-section">
        <AtmosphericEffects />
        <div className="writing-container">
          <FadeIn>
            <h2 className="section-title">Blogs</h2>
          </FadeIn>

          <div className="recent-posts">
            {staticPosts.map((post, index) => (
              <SlideIn key={index} direction="up" delay={0.2 + (index * 0.1)}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recent-post"
                >
                  <div className="recent-image-wrapper">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="recent-image"
                      />
                    ) : (
                      <svg className="recent-image-placeholder" viewBox="0 0 400 200" fill="none">
                        <rect width="400" height="200" fill="var(--color-bg-tertiary)"/>
                        <g opacity="0.3">
                          <path d="M150 80 L170 100 L200 70 L250 120" stroke="var(--color-accent-blue)" strokeWidth="3" fill="none"/>
                          <circle cx="150" cy="80" r="4" fill="var(--color-accent-blue)"/>
                          <circle cx="250" cy="120" r="4" fill="var(--color-accent-blue)"/>
                        </g>
                        <text x="200" y="160" textAnchor="middle" fill="var(--color-text-tertiary)" fontSize="14" fontFamily="var(--font-mono)">
                          Blog Post
                        </text>
                      </svg>
                    )}
                  </div>
                  <div className="recent-content">
                    <h4 className="recent-title">{post.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                      <p className="recent-date">{post.date}</p>
                      {post.readTime && (
                        <>
                          <span style={{ color: 'var(--color-text-tertiary)' }}>•</span>
                          <p className="recent-date">{post.readTime}</p>
                        </>
                      )}
                    </div>
                    <span className="recent-read-more">Read More →</span>
                  </div>
                </a>
              </SlideIn>
            ))}
          </div>

          {hashnodeUrl && (
            <FadeIn delay={0.8}>
              <div className="blog-cta-wrapper">
                <a
                  href={hashnodeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="blog-cta"
                >
                  View All Articles
                </a>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    );
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1, 4);

  return (
    <section className="writing-section">
      <AtmosphericEffects />
      <div className="writing-container">
        <FadeIn>
          <h2 className="section-title">Blogs</h2>
        </FadeIn>

        {featuredPost && (
          <SlideIn direction="up" delay={0.2}>
            <a
              href={featuredPost.url}
              target="_blank"
              rel="noopener noreferrer"
              className="featured-post"
            >
              {featuredPost.coverImage?.url && (
                <div className="featured-image-wrapper">
                  <img
                    src={featuredPost.coverImage.url}
                    alt={featuredPost.title}
                    className="featured-image"
                  />
                </div>
              )}
              <div className="featured-content">
                <h3 className="featured-title">{featuredPost.title}</h3>
                <p className="featured-date">
                  {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="featured-brief">{featuredPost.brief}</p>
                <span className="read-more">
                  Read More →
                </span>
              </div>
            </a>
          </SlideIn>
        )}

        {recentPosts.length > 0 && (
          <div className="recent-posts">
            {recentPosts.map((post, index) => (
              <SlideIn key={post.id} direction="up" delay={0.4 + (index * 0.1)}>
                <a
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="recent-post"
                >
                  {post.coverImage?.url && (
                    <div className="recent-image-wrapper">
                      <img
                        src={post.coverImage.url}
                        alt={post.title}
                        className="recent-image"
                      />
                    </div>
                  )}
                  <div className="recent-content">
                    <h4 className="recent-title">{post.title}</h4>
                    <p className="recent-date">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                    <span className="recent-read-more">Read More →</span>
                  </div>
                </a>
              </SlideIn>
            ))}
          </div>
        )}

        {hashnodeUrl && (
          <FadeIn delay={0.8}>
            <div className="blog-cta-wrapper">
              <a
                href={hashnodeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="blog-cta"
              >
                View All Articles
              </a>
            </div>
          </FadeIn>
        )}
      </div>
    </section>
  );
};

export default Writing;
