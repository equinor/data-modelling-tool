const base = require('../../../jest.config.base')
const packageJson = require('./package.json')

module.exports = {
  ...base,
  testEnvironment: 'jsdom', // React Testing Library needs a DOM to operate.
  name: packageJson.name,
  displayName: packageJson.name,
}
