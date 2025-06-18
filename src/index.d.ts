/**
 * PostHog Enhancer - A utility for tracking custom user interactions using PostHog.
 */

/**
 * Event type constants
 */
export const EVENTS: {
  /** Event for tracking user theme preferences */
  THEME_PREFERENCE: string;
  /** Event for tracking search actions */
  SEARCH: string;
  /** Event for tracking organization information */
  ORGANIZATION: string;
};

/**
 * Options for initializing the tracking module
 */
export interface TrackingOptions {
  /** Authentication key for the API */
  authKey?: string;
}

/**
 * Search data for tracking search events
 */
export interface SearchData {
  /** Search query */
  query?: string;
  /** Number of search results */
  resultsCount?: number;
  /** Search category */
  category?: string;
  /** Any additional properties */
  [key: string]: any;
}

/**
 * Organization data for tracking organization information
 */
export interface OrganizationData {
  /** Organization name */
  organization: string;
  /** Whether the organization is an ISP */
  is_isp?: boolean;
  /** Any additional properties */
  [key: string]: any;
}

/**
 * Core function to track custom events with PostHog
 * @param eventName - Name of the event to track
 * @param properties - Additional properties to include with the event
 * @returns True if the event was successfully tracked, false otherwise
 */
export function trackEvent(eventName: string, properties?: Record<string, any>): boolean;

/**
 * Tracks the user's theme preference (light or dark mode)
 */
export function trackThemePreference(): void;

/**
 * Adds a listener for theme preference changes
 */
export function addThemeChangeListener(): void;

/**
 * Removes the theme preference change listener
 */
export function removeThemeChangeListener(): void;

/**
 * Tracks search events
 * @param data - Data about the search
 */
export function trackSearch(data?: SearchData): void;

/**
 * Fetches organization information from the Astuteo Toolkit API and tracks it
 * @param authKey - Authentication key for the API
 * @returns Promise resolving to true if tracking was successful, false otherwise
 */
export function trackOrganization(authKey?: string | boolean): Promise<boolean>;

/**
 * Initializes the tracking module
 * @param options - Configuration options
 * @returns True if tracking was successfully initialized, false otherwise
 */
export function initTracking(options?: TrackingOptions): boolean;

/**
 * Cleans up tracking resources
 */
export function cleanup(): void;

/**
 * Tracking module API
 */
declare const tracking: {
  /** Initialize tracking */
  init: typeof initTracking;
  /** Clean up tracking resources */
  cleanup: typeof cleanup;
  /** Track theme preference */
  trackThemePreference: typeof trackThemePreference;
  /** Track search */
  trackSearch: typeof trackSearch;
  /** Track organization information */
  trackOrganization: typeof trackOrganization;
  /** Event type constants */
  events: typeof EVENTS;
};

export default tracking;
