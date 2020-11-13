/**
 * See https://cli.vuejs.org/config/
 */
module.exports = {
  devServer: {
    port: 3002,
    progress: process.env.CI ? false : true,
  },
}
