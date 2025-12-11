module.exports = {
  server: {
    baseDir: "./public",
    index: "index.html"
  },
  port: 3000,
  files: [
    "./public/*.html",
    "./src/css/*.css",
    "./src/js/**/*.js",
    "./public/data/*.json",
    "./src/views/*.html"
  ],
  watchOptions: {
    ignoreInitial: true,
    ignored: ["node_modules/**", ".git/**"]
  },
  open: true,
  notify: false,
  ghostMode: false
};
