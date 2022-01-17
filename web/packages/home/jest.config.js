const base = require('../../jest.config.base')
const packageJson = require('./package.json')

module.exports = {
  ...base,
  testEnvironment: 'jsdom',
  name: packageJson.name,
  displayName: packageJson.name,
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
}
