import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowUpRight,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Menu,
  MessageCircle,
  Play,
  Radio,
  Send,
  ShieldCheck,
  Sparkles,
  Video,
  X,
  Youtube
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import './styles.css';

const YOUTUBE_CHANNEL_ID = 'UCCZiCzPtg9pmDwChJ4ROIpA';
const HASHNODE_HOST = 'shishirsrivastav.hashnode.dev';

const fallbackConfig = {
  header: {
    greeting: 'Shishir Srivastav',
    tagline: 'Senior AI/ML Engineer & Tech Content Creator'
  },
  github_username: 'Shishir420-GIT',
  social_links: [],
  projects: { items: [] },
  experience: { jobs: [] },
  skills: { categories: [] }
};

function useConfig() {
  const [config, setConfig] = useState(fallbackConfig);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/config.json')
      .then((response) => response.json())
      .then((data) => setConfig({ ...fallbackConfig, ...data }))
      .catch(() => setConfig(fallbackConfig))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}

function useGithubRepos(username) {
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    if (!username) return;
    const controller = new AbortController();
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=9`, {
      signal: controller.signal
    })
      .then((response) => (response.ok ? response.json() : []))
      .then((items) => {
        const filtered = items
          .filter((repo) => !repo.fork)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 6);
        setRepos(filtered);
      })
      .catch(() => setRepos([]));
    return () => controller.abort();
  }, [username]);

  return repos;
}

function useHashnodePosts(host = HASHNODE_HOST) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!host) return;
    const controller = new AbortController();
    fetch('https://gql.hashnode.com/', {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          query Publication($host: String!) {
            publication(host: $host) {
              posts(first: 3) {
                edges {
                  node {
                    title
                    brief
                    url
                    publishedAt
                    coverImage {
                      url
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { host }
      })
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        const edges = data?.data?.publication?.posts?.edges || [];
        setPosts(edges.map((edge) => edge.node));
      })
      .catch(() => setPosts([]));
    return () => controller.abort();
  }, [host]);

  return posts;
}

function getSocial(config, name) {
  return config.social_links?.find((link) => link.name.toLowerCase().includes(name));
}

function compactDescription(description) {
  if (Array.isArray(description)) {
    return description.filter(Boolean).join(' ').replace(/\s+/g, ' ');
  }
  return description || '';
}

function App() {
  const { config, loading } = useConfig();
  const repos = useGithubRepos(config.github_username);
  const posts = useHashnodePosts(config.writing?.hashnode_host || HASHNODE_HOST);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    document.title = config.site?.title || 'Shishir Srivastav - Secure AI Systems';
  }, [config]);

  const github = getSocial(config, 'github')?.url || `https://github.com/${config.github_username}`;
  const linkedin = getSocial(config, 'linkedin')?.url || '#';
  const youtube = getSocial(config, 'youtube')?.url || `https://www.youtube.com/channel/${YOUTUBE_CHANNEL_ID}?sub_confirmation=1`;
  const hashnode = getSocial(config, 'hashnode')?.url || `https://${HASHNODE_HOST}`;
  const booking = config.contact?.booking_url || 'https://topmate.io/shishir_srivastav';
  const email = config.contact?.email || 'mailto:shishirsrivastavwho@gmail.com';
  const youtubeChannelId = config.youtube?.channel_id || YOUTUBE_CHANNEL_ID;
  const youtubeUploadsPlaylist = `UU${youtubeChannelId.slice(2)}`;

  const featuredProjects = useMemo(() => {
    const configured = config.projects?.items || [];
    return configured.slice(0, 4);
  }, [config.projects]);

  if (loading) {
    return <div className="boot-screen">Loading signal...</div>;
  }

  return (
    <>
      <div className="site-shell">
        <CursorSignal />
        <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} links={{ booking, youtube }} />
        <main>
          <Hero config={config} links={{ booking, youtube, github, linkedin }} />
          <YoutubeSection youtube={youtube} uploadsPlaylist={youtubeUploadsPlaylist} />
          <FeaturedWork projects={featuredProjects} onProjectClick={setSelectedProject} />
          <OperatingSystem config={config} />
          <GithubSection repos={repos} github={github} />
          <WritingSection posts={posts} hashnode={hashnode} />
          <SkillsSection config={config} />
          <ContactSection links={{ booking, youtube, github, linkedin, hashnode, email }} />
        </main>
        {selectedProject !== null && (
          <ProjectModal
            projects={featuredProjects}
            initialIndex={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
        <Chatbot />
      </div>
      <Analytics />
    </>
  );
}

function Header({ menuOpen, setMenuOpen, links }) {
  const nav = [
    ['Work', '#work'],
    ['Videos', '#youtube'],
    ['Experience', '#experience'],
    ['Projects', '#projects'],
    ['Writing', '#writing'],
    ['Contact', '#contact']
  ];

  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Shishir home">
        <span>SS</span>
        <strong>Secure AI Systems</strong>
      </a>
      <nav className={menuOpen ? 'nav open' : 'nav'} aria-label="Primary navigation">
        {nav.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
      </nav>
      <div className="topbar-actions">
        <a className="ghost-link" href={links.youtube} target="_blank" rel="noreferrer">
          <Youtube size={16} />
          YouTube
        </a>
        <a className="solid-link" href={links.booking} target="_blank" rel="noreferrer">
          Book a call
        </a>
        <button className="menu-button" type="button" onClick={() => setMenuOpen((value) => !value)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
    </header>
  );
}

function Hero({ config, links }) {
  const avatar = `https://avatars.githubusercontent.com/${config.github_username}`;
  const name = config.header?.greeting || 'Shishir Srivastav';
  const moveOnStage = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--stage-x', `${x}%`);
    event.currentTarget.style.setProperty('--stage-y', `${y}%`);
  };

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="hero-copy">
        <p className="eyebrow">
          <ShieldCheck size={16} aria-hidden="true" />
          AI Engineer / Automation Builder / Creator
        </p>
        <h1>
          Hi, <span>Shishir</span> this side.
        </h1>
        <p className="hero-philosophy">
          My work philosophy is: <strong>If it is structured, it can be automated. If not, let AI handle it.</strong>
        </p>
        <p className="hero-summary">
          I work across AI security, cloud automation, RAG systems, and technical education. The site is a map of what I build, what I teach, and how I think.
        </p>
        <div className="hero-actions">
          <a className="primary-action" href={links.booking} target="_blank" rel="noreferrer" aria-label="Book a call with Shishir">
            Book a call
            <ArrowUpRight size={18} aria-hidden="true" />
          </a>
          <a className="secondary-action" href={links.youtube} target="_blank" rel="noreferrer" aria-label="Watch videos on YouTube">
            Watch videos
            <Play size={17} aria-hidden="true" />
          </a>
        </div>
        <nav className="hero-links" aria-label="Social media links">
          <a href={links.github} target="_blank" rel="noreferrer" aria-label="Visit GitHub profile"><Github size={18} aria-hidden="true" /> GitHub</a>
          <a href={links.linkedin} target="_blank" rel="noreferrer" aria-label="Visit LinkedIn profile"><Linkedin size={18} aria-hidden="true" /> LinkedIn</a>
        </nav>
      </div>
      <div className="hero-stage" onPointerMove={moveOnStage} aria-label={`${name} work preview`} role="img">
        <MatrixLandscape />
        <div className="portrait-reveal">
          <img src={avatar} alt={`${name} portrait`} />
        </div>
        <div className="system-map" role="list" aria-label="Key focus areas">
          <div className="system-node active" role="listitem">Secure AI Gateway</div>
          <div className="system-node" role="listitem">Cloud Automation</div>
          <div className="system-node" role="listitem">RAG / Agents</div>
          <div className="system-node" role="listitem">Creator Notes</div>
        </div>
        <div className="video-strip" aria-label="YouTube preview strip" role="list">
          <div role="listitem">
            <Video size={18} aria-hidden="true" />
            Latest builds
          </div>
          <div role="listitem">
            <Radio size={18} aria-hidden="true" />
            AI / Cloud / Automation
          </div>
          <div role="listitem">
            <BookOpen size={18} aria-hidden="true" />
            Learn with me
          </div>
        </div>
      </div>
    </section>
  );
}

function MatrixLandscape() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (media.matches) return;

    const chars = 'अ आ इ  ई उ ऊ क ख ग घ ङ च छ ज झ ञ ट ठ ड ढ ण त थ द ध न प फ ब भ म य र ल व श ष स ह क्ष त्र ज्ञ';
    let width = 0;
    let height = 0;
    let particles = [];
    let pointer = { x: 1.2, y: 1.2, active: false };
    let frame;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      width = rect.width;
      height = rect.height;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      particles = Array.from({ length: Math.floor(width / 11) }, (_, index) => ({
        x: index * 12,
        y: Math.random() * height,
        speed: 0.45 + Math.random() * 1.2,
        char: chars[Math.floor(Math.random() * chars.length)]
      }));
    };

    const draw = () => {
      context.fillStyle = 'rgba(17, 17, 15, 0.16)';
      context.fillRect(0, 0, width, height);
      context.font = '12px JetBrains Mono, monospace';
      particles.forEach((particle) => {
        const pointerX = pointer.px !== undefined ? pointer.px : pointer.x * width;
        const pointerY = pointer.py !== undefined ? pointer.py : pointer.y * height;
        const distance = Math.hypot(particle.x - pointerX, particle.y - pointerY);
        const near = pointer.active && distance < 130;
        context.fillStyle = near ? 'rgba(236, 232, 220, 0.92)' : 'rgba(157, 169, 159, 0.28)';
        context.fillText(particle.char, particle.x, particle.y);
        particle.y += near ? particle.speed * 2.5 : particle.speed;
        if (particle.y > height + 20) {
          particle.y = -20;
          particle.char = chars[Math.floor(Math.random() * chars.length)];
        }
      });
      frame = requestAnimationFrame(draw);
    };

    const move = (event) => {
      const rect = canvas.getBoundingClientRect();
      const x = (event.clientX - rect.left);
      const y = (event.clientY - rect.top);
      pointer = {
        x: x / rect.width,
        y: y / rect.height,
        active: true,
        px: x,
        py: y
      };
      canvas.style.setProperty('--mx', `${pointer.x * 100}%`);
      canvas.style.setProperty('--my', `${pointer.y * 100}%`);
    };

    resize();
    draw();
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerleave', () => { pointer.active = false; });
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(frame);
      canvas.removeEventListener('pointermove', move);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas className="matrix-landscape" ref={canvasRef} aria-hidden="true" />;
}

function CursorSignal() {
  useEffect(() => {
    const move = (event) => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div className="cursor-signal" aria-hidden="true" />;
}

function ProjectModal({ projects, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const project = projects[currentIndex];

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) goToNext();
    if (isRightSwipe) goToPrevious();
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [currentIndex]);

  const techStack = project.tech_stack || [];
  const features = Array.isArray(project.description)
    ? project.description.slice(1).filter((line) => line.startsWith('•') || line.includes(':'))
    : [];

  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div
        className="project-modal-content"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close modal">
          <X size={24} />
        </button>

        <div className="modal-image-container">
          {project.picture && <img src={project.picture} alt={`${project.name} preview`} />}
          <div className="modal-navigation">
            <button onClick={goToPrevious} aria-label="Previous project" className="nav-button nav-prev">
              <ChevronLeft size={32} />
            </button>
            <button onClick={goToNext} aria-label="Next project" className="nav-button nav-next">
              <ChevronRight size={32} />
            </button>
          </div>
          <div className="modal-counter">
            {currentIndex + 1} / {projects.length}
          </div>
        </div>

        <div className="modal-details">
          <div className="modal-header">
            <span className="modal-date">{project.date || 'Build'}</span>
            <h2>{project.name}</h2>
          </div>

          <p className="modal-description">{compactDescription([project.description[0]])}</p>

          {features.length > 0 && (
            <div className="modal-features">
              <h3>Key Features</h3>
              <ul>
                {features.map((feature, idx) => (
                  <li key={idx}>{feature.replace(/^•\s*/, '').replace(/:\s*$/, '')}</li>
                ))}
              </ul>
            </div>
          )}

          {techStack.length > 0 && (
            <div className="modal-tech-stack">
              <h3>Tech Stack</h3>
              <div className="tech-tags">
                {techStack.map((tech) => (
                  <span key={tech} className="tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          <a
            className="modal-cta"
            href={project.link?.url || project.link || '#'}
            target="_blank"
            rel="noreferrer"
          >
            View Project
            <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}

function FeaturedWork({ projects, onProjectClick }) {
  return (
    <section className="section work-section" id="work">
      <SectionIntro
        eyebrow="Work highlights"
        title="Selected builds."
        text="Curated from GitHub-backed projects. Each tile answers what it is, what problem it solves, and why it matters."
      />
      <div className="feature-grid-new">
        {projects.map((project, index) => (
          <article
            className="feature-card-new"
            key={project.name}
            onClick={() => onProjectClick(index)}
          >
            <div className="feature-card-image-wrapper">
              {project.picture && (
                <img src={project.picture} alt={`${project.name} preview`} loading="lazy" />
              )}
              <button className="feature-card-favorite" aria-label="Add to favorites">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
              </button>
            </div>
            <div className="feature-card-content-new">
              <div className="feature-card-header-new">
                <span className="feature-card-category">{project.date || 'Build'}</span>
                <div className="feature-card-rating">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  <span>4.8</span>
                </div>
              </div>
              <h3 className="feature-card-title-new">{project.name}</h3>
              <p className="feature-card-tech">
                {(project.tech_stack || []).slice(0, 3).join(' • ')}
              </p>
              <div className="feature-card-footer-new">
                <div className="feature-card-price">
                  <span className="price-label">Open Source</span>
                </div>
                <a
                  href={project.link?.url || project.link || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="feature-card-link-new"
                  onClick={(e) => e.stopPropagation()}
                  aria-label="View project details"
                >
                  <ArrowUpRight size={18} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function YoutubeSection({ youtube, uploadsPlaylist }) {
  return (
    <section className="section youtube-section" id="youtube">
      <SectionIntro
        eyebrow="YouTube / teaching"
        title="I do not just build systems. I explain the path through them."
        text="Latest uploads are embedded from the channel uploads playlist, so the preview stays current without a YouTube API key."
      />
      <div className="youtube-layout">
        <div className="youtube-player">
          <iframe
            title="Latest videos from Shishir Srivastav"
            src={`https://www.youtube.com/embed/videoseries?list=${uploadsPlaylist}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
        <aside className="creator-panel">
          <div className="creator-stat">
            <span>Focus</span>
            <strong>AI, cloud, automation</strong>
          </div>
          <div className="creator-stat">
            <span>Format</span>
            <strong>Builds, explainers, career guidance</strong>
          </div>
          <div className="creator-stat">
            <span>CTA</span>
            <strong>Subscribe, then build with me</strong>
          </div>
          <a className="primary-action full" href={youtube} target="_blank" rel="noreferrer">
            Open YouTube
            <Youtube size={18} />
          </a>
        </aside>
      </div>
    </section>
  );
}

function OperatingSystem({ config }) {
  const jobs = config.experience?.jobs || [];
  const anonymized = jobs.map((job) => ({
    ...job,
    responsibilities: (job.responsibilities || []).slice(0, 3)
  }));

  return (
    <section className="section operating-section" id="experience">
      <SectionIntro
        eyebrow="Operating system"
        title="Enterprise experience, anonymized around outcomes."
        text="Company names stay visible. The work is framed around the kind of systems built, not internal implementation details."
      />
      <div className="experience-rail">
        {anonymized.map((job) => (
          <article className="experience-card" key={`${job.company}-${job.role}`}>
            <div className="experience-head">
              <div>
                <span>{job.date}</span>
                <h3>{job.company}</h3>
                <p>{job.role}</p>
              </div>
              {job.logo && <img src={job.logo} alt={`${job.company} logo`} loading="lazy" />}
            </div>
            <ul>
              {job.responsibilities?.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

function GithubSection({ repos, github }) {
  return (
    <section className="section github-section" id="projects">
      <SectionIntro
        eyebrow="GitHub"
        title="The automatic project shelf stays alive."
        text="Recent public repositories are fetched directly from GitHub, while the featured work above stays curated."
      />
      <div className="repo-grid">
        {repos.length ? repos.map((repo) => (
          <article className="repo-card" key={repo.id}>
            <div className="repo-head">
              <Github size={18} />
              <span>{repo.language || 'Repository'}</span>
            </div>
            <h3>{repo.name.replaceAll('-', ' ')}</h3>
            <p>{repo.description || 'Public build from GitHub.'}</p>
            <a href={repo.html_url} target="_blank" rel="noreferrer">
              View repository
              <ArrowUpRight size={15} />
            </a>
          </article>
        )) : (
          <article className="repo-card repo-card-empty">
            <Github size={22} />
            <h3>GitHub projects load live here</h3>
            <p>If the GitHub API is unavailable, visitors still have a direct path to the profile.</p>
            <a href={github} target="_blank" rel="noreferrer">Open GitHub <ArrowUpRight size={15} /></a>
          </article>
        )}
      </div>
    </section>
  );
}

function WritingSection({ posts, hashnode }) {
  const fallbackPosts = [
    {
      title: 'AI automation notes',
      brief: 'Practical writing on AI systems, cloud automation, and developer workflows.',
      url: hashnode,
      coverImage: null
    },
    {
      title: 'Build logs and tutorials',
      brief: 'A home for articles that turn experiments into repeatable learning.',
      url: hashnode,
      coverImage: null
    }
  ];
  const items = posts.length ? posts : fallbackPosts;

  return (
    <section className="section writing-section" id="writing">
      <SectionIntro
        eyebrow="Writing"
        title="Hashnode as the deeper reading path."
        text="The page attempts to fetch recent posts live. If the feed is blocked, it falls back to a clean path into the publication."
      />
      <div className="writing-grid">
        {items.map((post) => (
          <article className="writing-card" key={post.url || post.title}>
            {post.coverImage?.url && (
              <div className="writing-card-image">
                <img src={post.coverImage.url} alt={post.title} loading="lazy" />
              </div>
            )}
            <div className="writing-card-content">
              <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : 'Hashnode'}</span>
              <h3>{post.title}</h3>
              <p>{post.brief}</p>
              <a href={post.url || hashnode} target="_blank" rel="noreferrer">
                Read
                <ArrowUpRight size={15} />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function SkillsSection({ config }) {
  const categories = (config.skills?.categories || []).filter((category) => !category.name.toLowerCase().includes('certification'));
  const certifications = (config.skills?.categories || []).find((category) => category.name.toLowerCase().includes('certification'));

  return (
    <section className="section skills-section" id="skills">
      <SectionIntro
        eyebrow="Capability map"
        title="The stack is broad, but the through-line is systems thinking."
        text="No progress bars. The point is not percentage theater; it is where these tools fit in the work."
      />
      <div className="skills-layout">
        {categories.slice(0, 6).map((category) => (
          <article className="skill-card" key={category.name}>
            <h3>{category.name}</h3>
            <div>
              {category.items?.slice(0, 9).map((item) => (
                <span key={typeof item === 'string' ? item : item.name}>{typeof item === 'string' ? item : item.name}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
      {certifications && (
        <div className="cert-strip">
          <span>Certifications</span>
          {certifications.items?.slice(0, 5).map((item) => (
            <a key={item.name || item} href={item.url || '#'} target="_blank" rel="noreferrer">
              {item.name || item}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

function ContactSection({ links }) {
  return (
    <section className="contact-section" id="contact">
      <div>
        <p className="eyebrow">
          <Sparkles size={16} />
          Let’s build today
        </p>
        <h2>Need secure AI, automation, or someone who can explain the build clearly?</h2>
      </div>
      <div className="contact-actions">
        <a className="primary-action" href={links.booking} target="_blank" rel="noreferrer">
          Book a call
          <Calendar size={18} />
        </a>
        <a className="secondary-action" href={links.email}>
          Email me
          <Mail size={18} />
        </a>
        <a href={links.youtube} target="_blank" rel="noreferrer">YouTube</a>
        <a href={links.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={links.hashnode} target="_blank" rel="noreferrer">Hashnode</a>
      </div>
    </section>
  );
}

function SectionIntro({ eyebrow, title, text }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{text}</p>
    </div>
  );
}

function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: '> SYSTEM INITIALIZED\n> AI Assistant ready\n> Type your query below...'
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const getAIResponse = async (message) => {
    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1500));

    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('नमस्ते')) {
      return `> GREETING PROTOCOL ACTIVATED\n> Hello! I am Shishir's AI assistant\n> नमस्ते! मैं शिशिर का AI सहायक हूं\n> How can I help you today?`;
    } else if (lowerMessage.includes('project')) {
      return `> ACCESSING PROJECT DATABASE...\n> Shishir has worked on various AI/ML projects:\n• Manzil café - Virtual Space\n• Automation generator using AI\n• RAG-based knowledge retrieval systems\n• CRM data filling automation\n> Which project interests you most?`;
    } else if (lowerMessage.includes('skill') || lowerMessage.includes('technology')) {
      return `> SCANNING TECH STACK...\n> Primary technologies:\n• Python, JavaScript, TypeScript\n• AI/ML: Generative AI, LangChain, RAG\n• Cloud: AWS, Azure, GCP, OCI\n• Databases: MongoDB, MySQL\n> Specialization: Generative AI and automation`;
    } else if (lowerMessage.includes('experience')) {
      return `> RETRIEVING WORK HISTORY...\n> Current: AI Engineer at Tiger Analytics\n> Previous: Senior Technology Consultant II at EY GDS\n> Previous: Senior Python Developer at Wipro (4+ years)\n> Focus: AI/ML solutions, cloud automation, DevOps\n> Achievement: 30-40% reduction in resolution times`;
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('connect')) {
      return `> CONTACT PROTOCOLS AVAILABLE:\n• LinkedIn: Professional networking\n• GitHub: Code repositories\n• YouTube: Technical content\n• Email: shishirsrivastavwho@gmail.com\n> Preferred method: LinkedIn for professional inquiries`;
    } else {
      return `> PROCESSING QUERY...\n> I can provide information about Shishir's:\n• Technical skills and expertise\n• Professional experience\n• Projects and achievements\n• Contact information\n> Please specify what you'd like to know!`;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await getAIResponse(input);
      const botMessage = { role: 'bot', text: response };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { role: 'bot', text: '> ERROR: Connection failed. Please try again.' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        className={`chatbot-toggle ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open chat assistant"
      >
        <MessageCircle size={24} />
        <span className="chatbot-pulse" />
      </button>

      {isOpen && (
        <div className="chatbot-widget">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <MessageCircle size={18} />
              <div>
                <strong>AI Assistant</strong>
                <span>Ask me anything</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X size={20} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`chatbot-message ${msg.role}`}>
                <div className="message-text">
                  {msg.text.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="chatbot-message bot">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={isTyping}
            />
            <button onClick={handleSend} disabled={!input.trim() || isTyping} aria-label="Send message">
              <Send size={18} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
