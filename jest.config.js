const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig");

globalThis.ngJest = {
  skipNgcc: false, tsconfig: "tsconfig.spec.json"
};

module.exports = {
  testMatch: ["**/*.spec.ts"],
  testResultsProcessor: "jest-sonar-reporter",
  preset: "jest-preset-angular",
  verbose: false,
  collectCoverage: true,
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>src"}),
  },

  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"]

};
