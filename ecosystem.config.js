module.exports = {
  apps: [
    {
      name: 'smeshno',
      script: 'node_modules/.bin/next',
      args: 'start',
      env: {
        PORT: 3001,
        NODE_ENV: 'production',
      },
    },
  ],
}
