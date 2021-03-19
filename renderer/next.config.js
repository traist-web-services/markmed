module.exports = {
  webpack: (config) =>
    Object.assign(config, {
      target: "electron-renderer",
    }),
  env: {
    APP_NAME: "Märkméd",
  },
};
