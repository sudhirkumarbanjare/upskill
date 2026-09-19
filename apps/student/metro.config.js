const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const defaultConfig = getDefaultConfig(__dirname);

/**
 * Metro configuration for monorepo
 * https://reactnative.dev/docs/metro
 */
const config = {
  watchFolders: [
    path.resolve(monorepoRoot, 'packages/shared'),
    path.resolve(monorepoRoot, 'node_modules'),
  ],
  resolver: {
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(monorepoRoot, 'node_modules'),
    ],
    extraNodeModules: {
      '@upskill/shared': path.resolve(monorepoRoot, 'packages/shared/src'),
    },
  },
};

module.exports = mergeConfig(defaultConfig, config);
