// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const {
  wrapWithReanimatedMetroConfig,
} = require('react-native-reanimated/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Wrap the Expo config with Reanimated's config
module.exports = wrapWithReanimatedMetroConfig(config);
// This ensures that Reanimated's custom Babel plugin is applied correctly
// and that the Metro bundler is configured to handle Reanimated's requirements.