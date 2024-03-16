module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};