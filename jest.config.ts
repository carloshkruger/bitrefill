import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  resetMocks: true,
  restoreMocks: true,
  clearMocks: true,
  testEnvironment: "node",
  transform: {
    "^.+\\.ts?$": "ts-jest",
  },
  rootDir: "tests",
};

export default config;
