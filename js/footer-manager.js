// Footer Manager Module
export class FooterManager {
    updateFooterSection(config) {
        if (!config.footer) return;

        const footer = document.querySelector('.footer');
        if (!footer) return;

        // Update footer tagline
        this.updateFooterTagline(config.footer);

        // Update footer social links
        if (config.footer.show_social_links) {
            this.updateFooterSocialLinks(config);
        }

        // Update footer bottom content
        this.updateFooterBottom(config.footer);
    }

    updateFooterTagline(footerConfig) {
        const taglineElement = document.querySelector('.footer-tagline');
        if (taglineElement && footerConfig.tagline) {
            taglineElement.textContent = footerConfig.tagline;
        }
    }

    updateFooterSocialLinks(config) {
        const footerSocial = document.querySelector('.footer-social');
        if (!footerSocial) return;

        // Clear existing social links
        footerSocial.innerHTML = '';

        // Create document fragment for better performance
        const fragment = document.createDocumentFragment();

        // Extended social links for footer
        const extendedSocialLinks = [
            ...config.social_links,
            {
                name: 'Instagram',
                url: 'https://www.instagram.com/programmatic.ly',
                icon: 'instagram'
            },
            {
                name: 'Hashnode',
                url: 'https://hashnode.com/@ShishirSrivastav',
                icon: 'hashnode'
            },
            {
                name: 'Topmate',
                url: 'https://topmate.io/shishir_srivastav',
                icon: 'topmate'
            },
            {
                name: 'Credly',
                url: 'https://www.credly.com/users/shishir-srivastav-who',
                icon: 'credly'
            },
            {
                name: 'LinkedIn Follow',
                url: 'https://linkedin.com/comm/mynetwork/discovery-see-all?usecase=PEOPLE_FOLLOWS&followMember=shishir-srivastav',
                icon: 'linkedin'
            }
        ];
        
        if (extendedSocialLinks && Array.isArray(extendedSocialLinks)) {
            extendedSocialLinks.forEach(social => {
                const socialLink = this.createSocialLink(social);
                if (socialLink) {
                    fragment.appendChild(socialLink);
                }
            });
        }

        // Add Source Code link
        if (config.github_username) {
            const sourceCodeLink = this.createSocialLink({
                name: 'Source Code',
                url: `https://github.com/${config.github_username}/developer-portfolio`,
                icon: 'code'
            });
            if (sourceCodeLink) {
                fragment.appendChild(sourceCodeLink);
            }
        }

        footerSocial.appendChild(fragment);
    }

    createSocialLink(social) {
        const iconTemplate = document.querySelector(`#${social.icon}-icon`);
        if (!iconTemplate) return null;

        const link = document.createElement('a');
        link.href = social.url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', `${social.name} Profile`);

        const icon = iconTemplate.content.cloneNode(true);
        link.appendChild(icon);

        return link;
    }

    updateFooterBottom(footerConfig) {
        // Update "built with" text
        const builtWithElement = document.querySelector('.footer-built-with');
        if (builtWithElement) {
            if (footerConfig.show_built_with && footerConfig.built_with_text) {
                builtWithElement.textContent = footerConfig.built_with_text;
                builtWithElement.style.display = 'block';
            } else {
                builtWithElement.style.display = 'none';
            }
        }
    }
}