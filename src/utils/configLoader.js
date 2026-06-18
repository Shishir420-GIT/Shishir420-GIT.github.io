/**
 * Config Loader Utility
 * Loads and validates configuration from public/config.json
 */

let cachedConfig = null;

/**
 * Fetch and load configuration
 * @returns {Promise<Object>} Configuration object
 */
export const loadConfig = async () => {
  if (cachedConfig) {
    return cachedConfig;
  }

  try {
    const response = await fetch('/config.json');
    if (!response.ok) {
      throw new Error(`Failed to load config: ${response.statusText}`);
    }

    const config = await response.json();

    // Basic validation
    validateConfig(config);

    cachedConfig = config;
    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    // Return default fallback config
    return getDefaultConfig();
  }
};

/**
 * Validate configuration structure
 * @param {Object} config - Configuration object to validate
 * @throws {Error} If configuration is invalid
 */
const validateConfig = (config) => {
  // Check required top-level fields
  const requiredFields = ['header', 'social_links', 'contact'];

  for (const field of requiredFields) {
    if (!config[field]) {
      console.warn(`Missing required field in config: ${field}`);
    }
  }

  // Validate social links structure
  if (config.social_links && !Array.isArray(config.social_links)) {
    throw new Error('social_links must be an array');
  }

  return true;
};

/**
 * Get default fallback configuration
 * @returns {Object} Default configuration
 */
const getDefaultConfig = () => {
  return {
    features: {
      about: true,
      skills: true,
      experience: true,
      projects: true,
      github_projects: false,
      achievements: false
    },
    header: {
      greeting: 'Welcome',
      tagline: 'Portfolio'
    },
    hero: {
      headline: 'Hello, World',
      philosophy: 'Building the future.',
      focus: []
    },
    contact: {
      booking_url: '#',
      email: 'mailto:hello@example.com'
    },
    social_links: [],
    about: {
      paragraphs: ['Welcome to my portfolio.']
    },
    skills: {
      title: 'Skills',
      categories: []
    },
    experience: {
      title: 'Experience',
      jobs: []
    },
    projects: {
      title: 'Projects',
      items: []
    },
    writing: {
      hashnode_host: '',
      hashnode_url: ''
    },
    youtube: {
      channel_id: '',
      channel_url: '',
      featured_video_id: ''
    }
  };
};

/**
 * Get a specific config value by path
 * @param {string} path - Dot notation path (e.g., 'header.greeting')
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} Config value or default
 */
export const getConfigValue = (path, defaultValue = null) => {
  if (!cachedConfig) {
    console.warn('Config not loaded yet. Call loadConfig() first.');
    return defaultValue;
  }

  const keys = path.split('.');
  let value = cachedConfig;

  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value;
};

/**
 * Check if a feature is enabled
 * @param {string} featureName - Feature name from config.features
 * @returns {boolean} Whether feature is enabled
 */
export const isFeatureEnabled = (featureName) => {
  const features = getConfigValue('features', {});
  return features[featureName] === true;
};

/**
 * Clear cached config (useful for testing)
 */
export const clearConfigCache = () => {
  cachedConfig = null;
};
