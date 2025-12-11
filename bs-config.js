module.exports = {
  server: {
    baseDir: "./public",
    routes: {
      "/js": "./js",
      "/src": "./src"
    }
  },
  port: 3000,
  files: [
    "./public/*.html",
    "./src/css/*.css",
    "./src/js/**/*.js",
    "./public/data/*.json",
    "./src/views/*.html",
    "./js/*.js"
  ],
  watchOptions: {
    ignoreInitial: true,
    ignored: ["node_modules/**", ".git/**"]
  },
  open: true,
  notify: false,
  ghostMode: false,
  startPath: "/public/"
};
