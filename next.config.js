const {join} = require('path')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

module.exports = {
  webpack(config, {dev}) {
    if (!dev) {
      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: join(__dirname, 'reports/bundles.html'),
        defaultSizes: 'gzip'
      }))
    }

    return config
  },

  exportPathMap() {
    return {
      '/': {page: '/'},
      '/about': {page: '/about'},
      '/api': {page: '/api'},
      '/cgu': {page: '/cgu'},
      '/contrib': {page: '/contrib'},
      '/csv': {page: '/csv'},
      '/download': {page: '/download'},
      '/faq': {page: '/faq'},
      '/news': {page: '/news'},
      '/tools': {page: '/tools'}
    }
  }
}
