/**
 * Basic usage example for @astuteo/ph-enhancer
 */

// Import PostHog and the tracking module
import posthog from 'posthog-js';
import tracking from '@astuteo/ph-enhancer';

// Configuration
const config = {
  posthogHost: 'https://app.posthog.com', // Replace with your PostHog host
  posthogApiKey: 'your-posthog-api-key',  // Replace with your PostHog API key
  authKey: 'your-auth-key'                // Optional: for organization tracking
};

// Initialize PostHog first
posthog.init(config.posthogApiKey, {
  api_host: config.posthogHost,
});

// Then initialize the tracking module
tracking.init({
  authKey: config.authKey,
});

// Example: Track a search event
document.querySelector('#search-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const searchInput = document.querySelector('#search-input');
  const query = searchInput.value;

  // Track the search
  tracking.trackSearch({
    query,
    category: 'website',
  });

  // Continue with search functionality...
});

// Example: Clean up when component unmounts (e.g., in a SPA)
function cleanup() {
  tracking.cleanup();
}

// For demonstration purposes only
window.addEventListener('beforeunload', cleanup);
