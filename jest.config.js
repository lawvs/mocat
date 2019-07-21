module.exports = {
  clearMocks: true,
  browser: true,
  coverageDirectory: 'coverage',
  transform: {
    '^.+\\.(ts)$': 'ts-jest',
  },
  moduleFileExtensions: ['js', 'json', 'ts', 'tsx', 'node'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  setupFilesAfterEnv: ['./src/setupTests.ts'],
  collectCoverageFrom: ['./src/**/*.ts'],
}
