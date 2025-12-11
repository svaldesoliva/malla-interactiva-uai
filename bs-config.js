module.exports = {
  server: {
    baseDir: "./public",
    index: "index.html"
  },
  port: 3000,
  files: [
    "./public/*.html",
    "./public/js/*.js",
    "./public/css/*.css",
    "./public/data/*.json",
    "./public/views/*.html"
  ],
  watchOptions: {
    ignoreInitial: true,
    ignored: ["node_modules/**", ".git/**"]
  },
  open: true,
  notify: false,
  ghostMode: false
};