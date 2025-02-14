import { Config } from "jest"

const config: Config = {
  clearMocks: true,
  rootDir: ".",
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  transform: {
    "^.+\\.(t|j)s$": "@swc/jest"
  },
  coverageProvider: "v8",
  setupFilesAfterEnv:['./jest-setup.ts']

}
export default config;
