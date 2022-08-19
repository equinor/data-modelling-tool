const base = require('../../../jest.config.base')
const packageJson = require('./package.json')

module.exports = {
  ...base,
  name: packageJson.name,
  displayName: packageJson.name,
}
