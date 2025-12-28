module.exports = {
  src: "./apps",
  schema: "./schema.graphql",
  language: "typescript",
  exclude: [
    "**/node_modules/**",
    "**/__mocks__/**",
    "**/__generated__/**",
  ],
  eagerEsModules: true,
  // No artifactDirectory = co-located __generated__ folders
};
