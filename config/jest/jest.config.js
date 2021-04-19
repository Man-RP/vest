const path = require('path');

const { defaults: tsjPreset } = require('ts-jest/presets');

const { moduleAliases, filePaths } = require('../../util');

const moduleNameMapper = moduleAliases.reduce(
  (aliases, { name, absolute }) =>
    Object.assign(aliases, { [`^${name}$`]: absolute }),
  {}
);

module.exports = (options = {}) => ({
  clearMocks: true,
  moduleNameMapper,
  preset: 'ts-jest',
  rootDir: '.',
  roots: ['<rootDir>'],
  setupFilesAfterEnv: [path.join(filePaths.CONFIG_PATH, 'jest/jest.setup.js')],
  testEnvironment: 'node',
  testMatch: ['**/*.(spec|test).js'],
  transform: {
    ...tsjPreset.transform,
    '^.+\\.(ts|js)$': [
      'babel-jest',
      { configFile: filePaths.BABEL_CONFIG_PATH },
    ],
  },
  ...options,
});
