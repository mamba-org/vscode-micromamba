module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: ['tests/.*\\.test\\.ts$', 'src/.*\\.test\\.ts$'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '\\.(svg)$': '<rootDir>/tests/fileMock.ts',
  },
  globalSetup: './jest.setup.ts',
};
