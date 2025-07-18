// Section Manager Module
export class SectionManager {
    constructor(configManager) {
        this.configManager = configManager;
    }

    // Toggle section visibility based on feature flags
    toggleSection(sectionClass, isEnabled) {
        const section = document.querySelector(`.${sectionClass}`);
        if (section) {
            if (isEnabled) {
                section.style.display = 'block';
            } else {
                section.style.display = 'none';
            }
        }
    }

    // Update page content from config with feature flags
    updatePageContent(config) {
        // Ensure features object exists with defaults
        const features = {
            about: true,
            achievements: true,
            projects: true,
            experience: true,
            skills: true,
            github_projects: true,
            ...config.features
        };
        
        // Handle sections based on feature flags
        this.toggleSection('about', features.about);
        this.toggleSection('achievements', features.achievements);
        this.toggleSection('projects', features.projects);
        this.toggleSection('experience', features.experience);
        this.toggleSection('projects-on-github', features.github_projects);
        this.toggleSection('skills', features.skills);
        
        // Update sections that are enabled and have content
        if (features.about) {
            this.updateAboutSection(config);
        }
        
        if (features.achievements) {
            this.updateAchievementsSection(config);
        }
        
        if (features.projects) {
            this.updateProjectsSection(config);
        }
        
        if (features.experience) {
            this.updateExperienceSection(config);
        }
        
        // Update "Projects on GitHub" section title from config if available
        if (features.github_projects && config.github_projects?.title) {
            const githubProjectsTitle = document.querySelector('.projects-on-github h2');
            if (githubProjectsTitle) {
                githubProjectsTitle.textContent = config.github_projects.title;
            }
        }
        
        if (features.skills) {
            this.updateSkillsSection(config);
        }
    }

    // Update about section
    updateAboutSection(config) {
        const aboutSection = document.querySelector('.about');
        if (config.about?.paragraphs?.length) {
            aboutSection.innerHTML = config.about.paragraphs.map(p => `<p>${p}</p>`).join('');
        } else {
            aboutSection.innerHTML = '<p>Welcome to my portfolio!</p>';
        }
    }

    // Update achievements section
    updateAchievementsSection(config) {
        const achievementsSection = document.querySelector('.achievements');
        const titleElement = achievementsSection.querySelector('h2');
        
        if (titleElement) {
            titleElement.textContent = config.achievements?.title || 'Achievements';
        }
        
        const achievementsGrid = achievementsSection.querySelector('.achievements-grid');
        const fragment = document.createDocumentFragment();
        
        // Clear existing achievements
        achievementsGrid.innerHTML = '';
        
        // Create achievement cards
        if (config.achievements?.items?.length) {
            config.achievements.items.forEach(achievement => {
                const achievementCard = this.createAchievementCard(achievement);
                fragment.appendChild(achievementCard);
            });
        } else {
            // Show placeholder for empty achievements
            const emptyState = document.createElement('div');
            emptyState.className = 'achievement-card';
            emptyState.innerHTML = `
                <div class="achievement-icon">🏆</div>
                <h3>Your Achievements Will Appear Here</h3>
                <div class="achievement-stat">0</div>
                <div class="achievement-description">Add your achievements to the config.json file to showcase your accomplishments and milestones.</div>
            `;
            fragment.appendChild(emptyState);
        }
        
        // Append all achievement cards at once
        achievementsGrid.appendChild(fragment);
    }

    // Create individual achievement card
    createAchievementCard(achievement) {
        const achievementCard = document.createElement('div');
        achievementCard.className = `achievement-card ${achievement.type || ''}`;
        
        achievementCard.innerHTML = `
            <div class="achievement-icon">${achievement.icon || '🏆'}</div>
            <h3>${achievement.title}</h3>
            <div class="achievement-stat">${achievement.stat}</div>
            <div class="achievement-description">${achievement.description}</div>
            ${achievement.link ? `
            <a href="${achievement.link.url}" target="_blank" rel="noopener noreferrer" class="achievement-link" aria-label="View ${achievement.title}">
                ${achievement.link.title || 'Learn More'}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17l9.2-9.2M17 17V7H7"/>
                </svg>
            </a>
            ` : ''}
        `;
        
        return achievementCard;
    }

    // Update projects section dynamically
    updateProjectsSection(config) {
        const projectsSection = document.querySelector('.projects');
        const titleElement = projectsSection.querySelector('h2');
        
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('projects');
        }
        
        // Clear existing project items
        const existingProjectItems = projectsSection.querySelectorAll('.project-item');
        existingProjectItems.forEach(item => item.remove());
        
        // Create document fragment
        const fragment = document.createDocumentFragment();
        
        // Add all project items to fragment
        if (config.projects?.items?.length) {
            config.projects.items.forEach(project => {
                const projectItem = this.createProjectItem(project);
                fragment.appendChild(projectItem);
            });
        } else {
            // Show placeholder for empty projects
            const emptyState = document.createElement('div');
            emptyState.className = 'project-item';
            emptyState.innerHTML = `
                <div class="project-content">
                    <h3>Your Projects Will Appear Here</h3>
                    <p class="date">Coming Soon</p>
                    <ul>
                        <li>Add your projects to the config.json file</li>
                        <li>Include project descriptions and images</li>
                        <li>Showcase your best work</li>
                    </ul>
                </div>
            `;
            fragment.appendChild(emptyState);
        }
        
        // Append all projects at once for better performance
        projectsSection.appendChild(fragment);
    }

    // Create individual project item
    createProjectItem(project) {
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';
        
        const descriptionHtml = Array.isArray(project.description) 
            ? project.description.map(desc => `<li>${desc}</li>`).join('')
            : `<li>${project.description}</li>`;
        
        projectItem.innerHTML = `
            <div class="project-header">
                <div class="project-header-content">
                    <h3>${project.name}</h3>
                    ${project.date ? `<p class="date">${project.date}</p>` : ''}
                </div>
                <div class="project-accordion-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </div>
            </div>
            <div class="project-content">
                <div class="project-content-desktop">
                    <h3>${project.name}</h3>
                    ${project.date ? `<p class="date">${project.date}</p>` : ''}
                </div>
                <ul>
                    ${descriptionHtml}
                </ul>
                ${project.link ? `
                <div class="project-links">
                    <a href="${typeof project.link === 'object' ? project.link.url : project.link}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.name} project">
                        ${typeof project.link === 'object' ? (project.link.title || 'View Project') : 'View Project'}
                    </a>
                </div>
                ` : ''}
            </div>
            ${project.picture ? `
            <div class="project-image">
                <img src="${project.picture}" alt="${project.name} project screenshot" loading="lazy">
            </div>
            ` : ''}
        `;
        
        // Add click event listener for accordion functionality on mobile
        const header = projectItem.querySelector('.project-header');
        header.addEventListener('click', () => {
            this.toggleProjectAccordion(projectItem);
        });
        
        return projectItem;
    }

    // Update experience section dynamically
    updateExperienceSection(config) {
        const experienceSection = document.querySelector('.experience');
        const titleElement = experienceSection.querySelector('h2');
        
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('experience');
        }
        
        // Clear existing experience items
        const existingItems = experienceSection.querySelectorAll('.experience-item');
        existingItems.forEach(item => item.remove());
        
        // Create document fragment
        const fragment = document.createDocumentFragment();
        
        // Add all experience items to fragment
        if (config.experience?.jobs?.length) {
            config.experience.jobs.forEach(job => {
                const experienceItem = this.createExperienceItem(job);
                fragment.appendChild(experienceItem);
            });
        } else {
            // Show placeholder for empty experience
            const emptyState = document.createElement('div');
            emptyState.className = 'experience-item';
            emptyState.innerHTML = `
                <div class="experience-content">
                    <h3>Your Experience Will Appear Here</h3>
                    <p class="date">Ready to showcase your career</p>
                    <ul>
                        <li>Add your work experience to the config.json file</li>
                        <li>Include company logos and job descriptions</li>
                        <li>Highlight your achievements and responsibilities</li>
                    </ul>
                </div>
            `;
            fragment.appendChild(emptyState);
        }
        
        // Append all experience items at once
        experienceSection.appendChild(fragment);
    }

    // Create individual experience item
    createExperienceItem(job) {
        const experienceItem = document.createElement('div');
        experienceItem.className = 'experience-item';
        
        const responsibilitiesHtml = Array.isArray(job.responsibilities)
            ? job.responsibilities.map(resp => `<li>${resp}</li>`).join('')
            : `<li>${job.responsibilities}</li>`;
        
        let logoHtml = '';
        if (job.logo || job.logo_dark) {
            logoHtml = `
                <div class="company-logo">
                    ${job.logo ? `<img src="${job.logo}" alt="${job.company} logo" class="light-mode-logo" loading="lazy">` : ''}
                    ${job.logo_dark ? `<img src="${job.logo_dark}" alt="${job.company} logo" class="dark-mode-logo" loading="lazy">` : ''}
                </div>
            `;
        }
        
        experienceItem.innerHTML = `
            <div class="experience-header">
                <div class="experience-header-content">
                    <h3>${job.company} | ${job.role}</h3>
                    ${job.date ? `<p class="date">${job.date}</p>` : ''}
                </div>
                ${logoHtml}
                <div class="accordion-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="6,9 12,15 18,9"></polyline>
                    </svg>
                </div>
            </div>
            <div class="experience-content">
                <ul>
                    ${responsibilitiesHtml}
                </ul>
            </div>
        `;
        
        // Add click event listener for accordion functionality
        const header = experienceItem.querySelector('.experience-header');
        header.addEventListener('click', () => {
            this.toggleExperienceAccordion(experienceItem);
        });
        
        return experienceItem;
    }

    // Toggle experience accordion
    toggleExperienceAccordion(experienceItem) {
        experienceItem.classList.toggle('expanded');
    }

    // Toggle project accordion
    toggleProjectAccordion(projectItem) {
        projectItem.classList.toggle('expanded');
    }

    // Update skills section dynamically
    updateSkillsSection(config) {
        const skillsSection = document.querySelector('.skills');
        const titleElement = skillsSection.querySelector('h2');
        
        if (titleElement) {
            titleElement.textContent = this.configManager.getSectionTitle('skills');
        }
        
        const skillsGrid = skillsSection.querySelector('.skills-grid');
        const fragment = document.createDocumentFragment();
        
        // Clear existing skills
        skillsGrid.innerHTML = '';
        
        // Create skill categories
        if (config.skills?.categories?.length) {
            config.skills.categories.forEach(category => {
                const categoryDiv = this.createSkillCategory(category, config.skills.categories.indexOf(category));
                fragment.appendChild(categoryDiv);
            });
        } else {
            // Show placeholder for empty skills
            const emptyState = document.createElement('div');
            emptyState.className = 'skill-category';
            emptyState.innerHTML = `
                <h3>Your Skills Will Appear Here</h3>
                <div class="tech-stack-grid">
                    <div class="tech-item">
                        <div class="tech-icon">💻</div>
                        <div class="tech-name">Add Skills</div>
                        <div class="tech-level">Config</div>
                    </div>
                </div>
            `;
            fragment.appendChild(emptyState);
        }
        
        // Append all skill categories at once
        skillsGrid.appendChild(fragment);
    }

    // Create individual skill category
    createSkillCategory(category, index) {
        const categoryDiv = document.createElement('div');
        
        // Determine category type for styling
        let categoryType = '';
        const categoryName = category.name.toLowerCase();
        if (categoryName.includes('programming') || categoryName.includes('language')) {
            categoryType = 'programming';
        } else if (categoryName.includes('tool') || categoryName.includes('tech')) {
            categoryType = 'tools';
        } else if (categoryName.includes('certification')) {
            categoryType = 'certifications';
        }
        
        categoryDiv.className = `skill-category ${categoryType}`;
        
        // Handle certifications differently
        if (categoryType === 'certifications') {
            const itemsHtml = Array.isArray(category.items)
                ? category.items.map(item => {
                    if (typeof item === 'object' && item.name && item.url) {
                        return `
                            <div class="certification-item">
                                <a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.name}</a>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="certification-item">
                                <span>${item}</span>
                            </div>
                        `;
                    }
                }).join('')
                : `<div class="certification-item"><span>${category.items}</span></div>`;
            
            categoryDiv.innerHTML = `
                <h3>${category.name}</h3>
                <div class="certifications-list">
                    ${itemsHtml}
                </div>
            `;
        } else {
            // Tech stack grid for other categories
            const techItems = Array.isArray(category.items) ? category.items : [category.items];
            const techStackHtml = techItems.map(item => {
                const techName = typeof item === 'object' ? item.name : item;
                const techLevel = typeof item === 'object' ? (item.level || 'Advanced') : 'Advanced';
                const techIcon = this.getTechIcon(techName);
                
                return `
                    <div class="tech-item">
                        <div class="tech-icon">${techIcon}</div>
                        <div class="tech-name">${techName}</div>
                        <div class="tech-level">${techLevel}</div>
                    </div>
                `;
            }).join('');
            
            categoryDiv.innerHTML = `
                <h3>${category.name}</h3>
                <div class="tech-stack-grid">
                    ${techStackHtml}
                </div>
            `;
        }
        
        return categoryDiv;
    }

    // Get appropriate icon for technology
    getTechIcon(techName) {
        const iconMap = {
            // Languages
            'Python': '🐍',
            'JavaScript': '🟨',
            'TypeScript': '🔷',
            'Java': '☕',
            'C++': '⚡',
            'R': '📊',
            'HTML5': '🌐',
            'CSS3': '🎨',
            'Shell Scripting': '🐚',
            'PowerShell': '💙',
            'YAML': '📄',
            
            // Frameworks
            'React.js': '⚛️',
            'Node.js': '🟢',
            'Flask': '🌶️',
            'Django': '🎸',
            'FastAPI': '⚡',
            'GraphQL': '🔗',
            'RESTful APIs': '🔌',
            
            // ML/DS
            'NumPy': '🔢',
            'Pandas': '🐼',
            'PyTorch': '🔥',
            'TensorFlow': '🧠',
            'Scikit-learn': '🤖',
            'LangChain': '🔗',
            'Streamlit': '📊',
            'Gradio': '🎛️',
            
            // Cloud & DevOps
            'AWS Services': '☁️',
            'Google Cloud Platform (GCP)': '🌩️',
            'Docker': '🐳',
            'Kubernetes': '⚓',
            'Terraform': '🏗️',
            'Linux/Unix': '🐧',
            'Git & GitHub': '🐙',
            
            // Default
            'default': '⚙️'
        };
        
        return iconMap[techName] || iconMap['default'];
    }
}
