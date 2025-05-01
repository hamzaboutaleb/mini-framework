module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "last 2 versions, > 1%, not dead",
        useBuiltIns: false,
        modules: false,
      },
    ], // Keeps ES Modules (ESM)
    ["@babel/preset-react", { runtime: "classic", pragma: "h" }],
  ],
};
