module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testRegex: 'tests/.*\\.test\\.ts$',
  collectCoverageFrom: ['src/**/*.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  moduleNameMapper: {
    '\\.(svg)$': '<rootDir>/tests/fileMock.ts',
  },
};
