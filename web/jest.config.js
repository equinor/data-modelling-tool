const baseConfig = require('./jest.config.base')

module.exports = {
  ...baseConfig,
  roots: ['<rootDir>'],
  projects: [
    // specifying the jest configuration of each package will force Jest to NOT run test from Root too,
    // but instead just run tests in packages and use root as the folder to dump the coverage report
    '<rootDir>/packages/*/jest.config.js',
    '<rootDir>/packages/plugins/**/jest.config.js',
  ],
}
