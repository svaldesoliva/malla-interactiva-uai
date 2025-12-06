module.exports = {
  server: {
    baseDir: "./",
    index: "index.html"
  },
  port: 3000,
  files: [
    "./*.html",
    "./css/*.css",
    "./js/*.js",
    "./data/*.json",
    "./views/*.html"
  ],
  watchOptions: {
    ignoreInitial: true,
    ignored: ["node_modules/**", ".git/**"]
  },
  open: true,
  notify: false,
  ghostMode: false
};
