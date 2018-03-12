const {join} = require('path')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

module.exports = {
  webpack(config, {dev, isServer}) {
    if (!dev && !isServer) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: join(__dirname, 'reports/bundles.html'),
        defaultSizes: 'gzip'
      }))
    }

    return config
  }
}
