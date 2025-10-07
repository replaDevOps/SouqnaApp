// config.js
let config;

try {
  config = require('./config.private').default;
} catch (error) {
  console.warn('⚠️ config.private.js not found. Using fallback config.');
  config = {
    BASE_URL: 'https://fallback-api.com/api',
    IMAGE_BASE_URL: 'https://fallback-api.com/',
  };
}

export default config;
