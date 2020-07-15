module.exports = {
  apps: [
    {
      name: "dashboard",
      script: "./node_modules/nuxt/bin/nuxt.js",
      args: "start",
      env: {
        HOST: "0.0.0.0",
        PORT: 13000,
        NODE_ENV: "production"
      }
    }
  ]
}
