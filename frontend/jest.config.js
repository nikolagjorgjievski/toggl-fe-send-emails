const config = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  verbose: true,
  testEnvironmentOptions: {
    url: "http://localhost/",
  },
};

module.exports = config;
