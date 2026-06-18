# Portfolio - Modern Developer Portfolio

A stunning, config-driven portfolio website built with React, Vite, and Framer Motion. Features atmospheric effects, glassmorphism design, smooth animations, and seamless integration with YouTube, Hashnode, and more.

## Features

### Dynamic Sections
- **Hero Section** - Eye-catching landing page with glassmorphism social links bar
- **About** - Personal introduction with focus areas and philosophy
- **Skills Forest** - Interactive skill tree visualization with atmospheric effects
- **Professional Journey** - Timeline-based experience display with company logos
- **Projects Gallery** - Showcase your best projects with descriptions and tech stacks
- **YouTube Integration** - Featured and suggested videos from your channel
- **Writing & Articles** - Live Hashnode blog integration with fallback to static posts
- **Certifications** - Display your professional certifications and achievements
- **Contact** - Multiple contact methods with glassmorphism design

### Visual Effects
- **Atmospheric Effects** - Light rays, floating leaves, mist layers, and fireflies across all sections
- **Matrix Background** - Animated matrix rain effect throughout the site
- **Glassmorphism** - Modern frosted glass effects on hero social links and UI elements
- **Smooth Animations** - Framer Motion powered animations (FadeIn, SlideIn, etc.)
- **Responsive Design** - Mobile-first approach with optimized layouts for all devices

### Technical Highlights
- **Config-Driven** - Single JSON file (`config.json`) controls all content
- **Live API Integrations** - Real-time data from YouTube and Hashnode
- **Performance Optimized** - Code splitting, lazy loading, optimized builds
- **SEO Ready** - Meta tags, Open Graph, Twitter Cards support
- **Navigation Dots** - Smooth scrolling between sections with visual indicators

## Design Philosophy

**Minimalist Futurism with Atmospheric Depth**

- Monochromatic color palette (deep blacks, cool grays, blues)
- Atmospheric effects that add depth without distraction
- Large, bold typography with generous whitespace
- GPU-accelerated animations with custom easing curves
- Glassmorphism effects for modern, sophisticated UI elements
- Consistent visual language across all sections

## Tech Stack

### Frontend
- **React 19.2.6** - Latest React with concurrent features
- **Vite 8.0.12** - Lightning-fast build tool and dev server
- **Framer Motion 12.40.0** - Production-ready animation library

### Styling
- **Custom CSS** - CSS variables for theming
- **Responsive Design** - Mobile, tablet, desktop breakpoints
- **Glassmorphism** - Backdrop filters and transparency effects
- **Atmospheric Effects** - Custom animated visual effects

### Development
- **ESLint** - Code quality and consistency
- **React Hooks** - Modern React patterns (useState, useEffect, useMemo, useCallback)
- **Component Architecture** - Modular and reusable components

### Integrations
- **Hashnode GraphQL API** - Live blog post fetching
- **YouTube Embed API** - Video integration
- **SEO Optimization** - Meta tags and Open Graph

## Project Structure

```
portfolio-rebuild/
├── public/
│   ├── config.json              # Main configuration file
│   ├── assets/
│   │   ├── images/
│   │   │   └── projects/        # Project screenshots
│   │   └── logos/               # Company logos
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── animations/          # Reusable animation components
│   │   │   ├── FadeIn.jsx
│   │   │   ├── FadeIn.css
│   │   │   ├── SlideIn.jsx
│   │   │   └── SlideIn.css
│   │   ├── effects/             # Visual effect components
│   │   │   ├── AtmosphericEffects.jsx
│   │   │   └── AtmosphericEffects.css
│   │   ├── sections/            # Page sections
│   │   │   ├── Hero.jsx / Hero.css
│   │   │   ├── About.jsx / About.css
│   │   │   ├── SkillsTree.jsx / SkillsTree.css
│   │   │   ├── ExperienceTimeline.jsx / ExperienceTimeline.css
│   │   │   ├── ProjectsGallery.jsx / ProjectsGallery.css
│   │   │   ├── Writing.jsx / Writing.css
│   │   │   ├── YouTube.jsx / YouTube.css
│   │   │   ├── Certifications.jsx / Certifications.css
│   │   │   └── Contact.jsx / Contact.css
│   │   └── ui/                  # UI components
│   │       ├── NavigationDots.jsx / NavigationDots.css
│   │       └── MatrixBackground.jsx / MatrixBackground.css
│   ├── styles/
│   │   └── global.css           # Global styles and CSS variables
│   ├── utils/
│   │   └── configLoader.js      # Configuration loader
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Root styles
├── index.html                   # HTML template
├── vite.config.js               # Vite configuration with proxy
├── package.json                 # Dependencies and scripts
└── README.md                    # This file
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd portfolio-rebuild
```

2. Install dependencies:
```bash
npm install
```

3. Configure your portfolio:
Edit `public/config.json` with your personal information, projects, experience, etc.

4. Add your assets:
- Place project screenshots in `public/assets/images/projects/`
- Place company logos in `public/assets/logos/`

5. Start the development server:
```bash
npm run dev
```

6. Open your browser:
Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized production build will be in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

## Configuration Guide

### config.json Structure

The entire portfolio is driven by a single configuration file. Here's what you can customize:

#### Site Metadata
```json
{
  "site": {
    "title": "Your Name - Title",
    "description": "Your bio",
    "seo": {
      "title": "SEO Title",
      "description": "SEO Description",
      "keywords": "your, keywords, here",
      "author": "Your Name",
      "og_image": "https://your-image-url.com/image.png",
      "twitter_card": "summary_large_image",
      "base_url": "https://your-portfolio.com"
    }
  }
}
```

#### Hero Section
```json
{
  "hero": {
    "headline": "Your headline",
    "philosophy": "Your philosophy or tagline",
    "focus": [
      "Focus Area 1",
      "Focus Area 2",
      "Focus Area 3"
    ]
  }
}
```

#### Social Links
```json
{
  "social_links": [
    {
      "name": "GitHub",
      "url": "https://github.com/yourusername",
      "icon": "github",
      "required": true
    },
    {
      "name": "LinkedIn",
      "url": "https://linkedin.com/in/yourprofile",
      "icon": "linkedin",
      "required": true
    }
  ]
}
```

Available icons: `github`, `linkedin`, `twitter`, `instagram`, `youtube`, `hashnode`, `website`

#### Experience
```json
{
  "experience": {
    "jobs": [
      {
        "company": "Company Name",
        "role": "Your Role",
        "date": "Start - End",
        "responsibilities": [
          "Achievement 1",
          "Achievement 2"
        ],
        "logo": "assets/logos/company-logo.png",
        "logo_dark": "assets/logos/company-logo-dark.png"
      }
    ]
  }
}
```

#### Projects
```json
{
  "projects": {
    "items": [
      {
        "name": "Project Name",
        "date": "Month Year",
        "description": [
          "Project description",
          "Feature 1",
          "Feature 2"
        ],
        "picture": "assets/images/projects/project.png",
        "tech_stack": ["React", "Node.js", "MongoDB"],
        "link": {
          "url": "https://github.com/yourusername/project",
          "title": "View Project"
        }
      }
    ]
  }
}
```

#### YouTube Integration
```json
{
  "youtube": {
    "channel_id": "YOUR_CHANNEL_ID",
    "channel_url": "https://youtube.com/@yourhandle",
    "featured_video_id": "VIDEO_ID",
    "featured_video_title": "Video Title",
    "suggested_videos": [
      {
        "video_id": "VIDEO_ID",
        "title": "Video Title"
      }
    ]
  }
}
```

#### Writing/Blog Integration
```json
{
  "writing": {
    "hashnode_host": "yourblog.hashnode.dev",
    "hashnode_url": "https://yourblog.hashnode.dev",
    "posts": [
      {
        "title": "Blog Post Title",
        "url": "https://yourblog.hashnode.dev/post-slug",
        "date": "Mon DD, YYYY",
        "readTime": "X min read"
      }
    ]
  }
}
```

The `posts` array serves as a fallback if the Hashnode API fails or returns no data.

#### Skills
```json
{
  "skills": {
    "categories": [
      {
        "name": "Category Name",
        "items": [
          "Skill 1",
          "Skill 2",
          {
            "name": "Certification Name",
            "url": "https://certification-url.com"
          }
        ]
      }
    ]
  }
}
```

#### Contact
```json
{
  "contact": {
    "booking_url": "https://your-booking-link.com",
    "email": "mailto:your-email@example.com"
  }
}
```

### Feature Toggles

Enable or disable sections:
```json
{
  "features": {
    "about": true,
    "achievements": true,
    "projects": true,
    "experience": true,
    "skills": true
  }
}
```

## Customization

### Theme Colors

Edit CSS variables in `src/styles/global.css`:

```css
:root {
  /* Colors */
  --color-bg-primary: #0a0e27;
  --color-bg-secondary: #0f1419;
  --color-bg-tertiary: #1a1f2e;

  --color-text-primary: #e8eaed;
  --color-text-secondary: #9aa0a6;
  --color-text-tertiary: #5f6368;

  --color-accent-blue: #5b9fd8;
  --color-accent-cyan: #6dd5ed;
}
```

### Adding New Sections

1. Create component in `src/components/sections/YourSection.jsx`
2. Import in `src/App.jsx`
3. Add to sections array with feature flag:
```javascript
{
  id: 'your-section',
  component: YourSection,
  enabled: config?.features?.your_section !== false
}
```

### Custom Animations

Use the reusable animation components:

```jsx
import FadeIn from '../animations/FadeIn';
import SlideIn from '../animations/SlideIn';

<FadeIn delay={0.2}>
  <YourComponent />
</FadeIn>

<SlideIn direction="left" delay={0.4}>
  <YourComponent />
</SlideIn>
```

Available directions: `left`, `right`, `up`, `down`

### Atmospheric Effects

Add atmospheric effects to any section:

```jsx
import AtmosphericEffects from '../effects/AtmosphericEffects';

<section className="your-section">
  <AtmosphericEffects />
  <div className="your-container">
    {/* Your content */}
  </div>
</section>
```

Make sure the section has:
```css
.your-section {
  position: relative;
  overflow: hidden;
}

.your-container {
  position: relative;
  z-index: 1;
}
```

## API Integrations

### YouTube API
The YouTube section uses iframe embeds. No API key required.
- Featured video displayed prominently
- Suggested videos in a carousel
- Auto-updates when config changes

### Hashnode API
- GraphQL API integration
- Fetches latest 4 blog posts
- Falls back to static posts in config if API fails
- Development proxy configured in `vite.config.js`

## Deployment

### GitHub Pages

1. Update `vite.config.js` base path:
```javascript
export default defineConfig({
  base: '/your-repo-name/',
  // ...
})
```

2. Build and deploy:
```bash
npm run build
# Deploy dist/ folder to GitHub Pages
```

### Netlify

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Deploy!

### Vercel

1. Import your GitHub repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy!

## Performance

### Optimization Features
- Code splitting with dynamic imports
- Lazy loading of images
- CSS minification
- Tree shaking
- Production builds are optimized with Vite
- GPU-accelerated animations using `transform` and `opacity`

### Best Practices
- All images should be optimized (WebP recommended)
- Keep config.json under 100KB
- Atmospheric effects are performance-optimized

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Focus visible states
- Alt text for images

## Troubleshooting

### Dev server not starting
```bash
rm -rf node_modules
npm install
npm run dev
```

### Config not loading
- Check `public/config.json` is valid JSON
- Use JSONLint.com to validate
- Check browser console for errors

### Animations not working
- Ensure Framer Motion is installed: `npm install framer-motion`
- Check that components are wrapped in animation components

### Hashnode posts not loading
- Verify `hashnode_host` in config
- Check browser console for CORS errors
- Fallback to static posts if API fails

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Credits

Built with:
- [React](https://react.dev/)
- [Vite](https://vite.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## Support

If you like this portfolio template, please give it a star on GitHub!

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ by Shishir Srivastav**
