module.exports = {
  preset: 'ts-jest',
  roots: ['<rootDir>/src'],
  testEnvironment: 'node',
  collectCoverage: false,
  collectCoverageFrom: ['<rootDir>/**/*.{js,ts,tsx}'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
    '<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'node'],
  coverageDirectory: '<rootDir>/coverage/',
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 15,
      lines: 15,
      statements: 15,
    },
  },
  coverageReporters: ['json-summary', 'text', 'lcov'],
}
