/**
 * @type {import('@jest/types').Config.InitialOptions}
 * See https://jestjs.io/docs/en/configuration
 */
const jestConfig = {
  preset: 'ts-jest',
  clearMocks: true,
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  testPathIgnorePatterns: ['<rootDir>/cypress'],
  setupFilesAfterEnv: ['<rootDir>/scripts/setupTests.ts'],
  collectCoverageFrom: ['./packages/**/src/*.ts'],
}

module.exports = jestConfig
