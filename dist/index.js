'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var posthog = require('posthog-js');

/**
 * @fileoverview PostHog Enhancer - A utility for tracking custom user interactions using PostHog.
 * @module @astuteo/ph-enhancer
 * @requires posthog-js
 */

/**
 * @constant {Object} EVENTS - Enumeration of custom event types used for tracking
 * @property {string} THEME_PREFERENCE - Event for tracking user theme preferences
 * @property {string} SEARCH - Event for tracking search actions
 * @property {string} ORGANIZATION - Event for tracking organization information
 */
const EVENTS = {
  THEME_PREFERENCE: 'theme_preference',
  SEARCH: 'search',
  ORGANIZATION: 'organization',
};

/**
 * @type {string|null} - Stores the last tracked theme preference
 */
let lastTheme = null;

/**
 * @type {Function|null} - Reference to the theme change listener function
 */
let mediaQueryListener = null;

// PostHog automatically collects device and viewport information

/**
 * Core function to track custom events with PostHog
 *
 * @function trackEvent
 * @param {string} eventName - Name of the event to track
 * @param {Object} [properties={}] - Additional properties to include with the event
 * @returns {boolean} True if the event was successfully tracked, false otherwise
 */
const trackEvent = (eventName, properties = {}) => {
  try {
    if (typeof window === 'undefined' || !posthog?.capture) return false;

    posthog.capture(eventName, properties);

    return true;
  } catch (error) {
    console.error('Tracking error:', error);
    return false;
  }
};

/**
 * Tracks the user's theme preference (light or dark mode)
 *
 * @function trackThemePreference
 * @returns {void}
 */
const trackThemePreference = () => {
  try {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const currentTheme = prefersDark ? 'dark' : 'light';
    if (currentTheme === lastTheme) return;
    lastTheme = currentTheme;

    trackEvent(EVENTS.THEME_PREFERENCE, {
      theme: currentTheme,
      prefers_dark_mode: prefersDark,
    });

    posthog.people.set({ prefers_dark_mode: prefersDark });
  } catch (error) {
    console.error('Error tracking theme preference:', error);
  }
};

/**
 * Adds a listener for theme preference changes
 *
 * @function addThemeChangeListener
 * @returns {void}
 */
const addThemeChangeListener = () => {
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQueryListener = trackThemePreference;

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', mediaQueryListener);
    } else {
      mediaQuery.addListener(mediaQueryListener); // fallback
    }
  } catch (error) {
    console.error('Error adding theme listener:', error);
  }
};

/**
 * Removes the theme preference changes listener
 *
 * @function removeThemeChangeListener
 * @returns {void}
 */
const removeThemeChangeListener = () => {
  try {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQueryListener) {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', mediaQueryListener);
      } else {
        mediaQuery.removeListener(mediaQueryListener);
      }
    }
  } catch (error) {
    console.error('Error removing theme listener:', error);
  }
};

/**
 * Tracks search events
 *
 * @function trackSearch
 * @param {Object} [data={}] - Data about the search
 * @param {string} [data.query] - Search query
 * @param {number} [data.resultsCount] - Number of search results
 * @param {string} [data.category] - Search category
 * @returns {void}
 */
const trackSearch = (data = {}) => {
  trackEvent(EVENTS.SEARCH, {
    search_query: data.query || '',
    search_results_count: data.resultsCount || 0,
    search_category: data.category || '',
    ...data,
  });
};

/**
 * Fetches organization information from the Astuteo Toolkit API and tracks it
 *
 * @function trackOrganization
 * @param {string|boolean} [authKey=false] - Authentication key for the API
 * @returns {Promise<boolean>} Promise resolving to true if tracking was successful, false otherwise
 */
const trackOrganization = async (authKey = false) => {
  if(!authKey) return false;
  try {
    if (typeof window === 'undefined' || !posthog?.capture) return false;

    const response = await fetch(`/astuteo-toolkit/info?authKey=${authKey}`);

    if (!response.ok) {
      console.error('Failed to fetch organization data:', response.statusText);
      return false;
    }

    const data = await response.json();
    if (!data || !data.organization) {
      console.error('Organization data not found in response');
      return false;
    }

    // Track the organization as an event
    trackEvent(EVENTS.ORGANIZATION, {
      organization: data.organization
    });

    // Also set it as a user property
    posthog.people.set({ organization: data.organization });

    return true;
  } catch (error) {
    console.error('Error tracking organization:', error);
    return false;
  }
};

/**
 * Initializes the tracking module
 *
 * @function initTracking
 * @param {Object} [options={}] - Configuration options
 * @param {string} [options.authKey] - Authentication key for the API
 * @returns {boolean} True if tracking was successfully initialized, false otherwise
 */
const initTracking = (options = {}) => {
  if (typeof window === 'undefined' || !posthog) return false;

  try {
    posthog.people.set_once({
      initial_referrer: document.referrer,
    });

    trackThemePreference();
    addThemeChangeListener();

    // Fetch and track organization information
    // Using .catch to prevent any promise rejection from breaking initialization
    trackOrganization(options.authKey).catch(error => {
      console.error('Failed to track organization during initialization:', error);
    });

    return true;
  } catch (error) {
    console.error('Error initializing tracking:', error);
    return false;
  }
};

/**
 * Cleans up tracking resources
 *
 * @function cleanup
 * @returns {void}
 */
const cleanup = () => {
  removeThemeChangeListener();
  lastTheme = null;
};

/**
 * Default export with all tracking functions
 */
var index = {
  init: initTracking,
  cleanup,
  trackThemePreference,
  trackSearch,
  trackOrganization,
  events: EVENTS,
};

exports.EVENTS = EVENTS;
exports.addThemeChangeListener = addThemeChangeListener;
exports.cleanup = cleanup;
exports.default = index;
exports.initTracking = initTracking;
exports.removeThemeChangeListener = removeThemeChangeListener;
exports.trackEvent = trackEvent;
exports.trackOrganization = trackOrganization;
exports.trackSearch = trackSearch;
exports.trackThemePreference = trackThemePreference;
