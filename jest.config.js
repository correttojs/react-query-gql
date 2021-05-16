module.exports = {
  moduleNameMapper: {
    "^@/(.*)": "<rootDir>/src/$1",
  },
  moduleFileExtensions: ["js", "ts", "tsx"],
  modulePathIgnorePatterns: [
    "<rootDir>/.next",
    "<rootDir>/coverage/",
    "<rootDir>/cache",
    "<rootDir>/dist",
    "<rootDir>/example",
  ],
  preset: "ts-jest",
  testEnvironment: "jsdom",
};
