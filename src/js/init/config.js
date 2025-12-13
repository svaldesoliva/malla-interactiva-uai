/**
 * Configuration file for Malla Interactiva UAI
 * 
 * This file contains all the configuration settings for the application.
 * Modify these values to customize the behavior of the application.
 */

const CONFIG = {
  // Institution Information
  INSTITUTION: {
    name: 'Universidad Adolfo Ibáñez',
    shortName: 'UAI',
    defaultCareer: 'INF',
    websiteUrl: 'https://www.uai.cl'
  },

  // Credits System Configuration
  CREDITS: {
    // Only SCT credit system is used
    defaultSystem: 'SCT',
    showSystemToggle: false
  },

  // Security & Domain Configuration
  SECURITY: {
    // Enable domain checking (set to false to allow any domain)
    enableDomainCheck: false,
    // List of allowed domains (only used if enableDomainCheck is true)
    allowedDomains: [
      'localhost',
      'svaldes.github.io',
      'uai.cl'
    ]
  },

  // Feature Flags
  FEATURES: {
    // Enable service worker for offline functionality
    enableServiceWorker: false, // Disabled due to Safari bug
    // Enable analytics tracking
    enableAnalytics: false,
    // Enable social sharing features
    enableSharing: true,
    // Enable last update date display
    enableLastUpdateDate: true
  },

  // API Configuration
  API: {
    baseURL: './',
    careersEndpoint: '/data/carreras.json',
    welcomeTextsEndpoint: '/data/welcomeTexts.json',
    dateEndpoint: '/date.txt',
    dataPrefix: '/data/',
    colorsPrefix: '/data/colores/'
  },

  // UI Configuration
  UI: {
    // Viewport height calculation for mobile browsers
    enableViewportHeightFix: true,
    // Show welcome overlay on first visit
    showWelcomeOverlay: true
  },

  // Development Settings
  DEV: {
    // Enable console logging
    enableLogging: true,
    // Enable debug mode
    debugMode: false
  }
};

// Export for use in modules (if using module system)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}