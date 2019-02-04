const {join} = require('path')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')
const nextRuntimeDotenv = require('next-runtime-dotenv')

const withConfig = nextRuntimeDotenv({
  public: [
    'API_BAL_URL',
    'API_EXPLORE_URL',
    'API_EXPLORE_SEARCH_URL',
    'PIWIK_URL',
    'PIWIK_SITE_ID'
  ]
})

const commonModules = [
  '/node_modules/fbjs/',
  '/node_modules/next/',
  '/node_modules/lodash/',
  '/node_modules/webpack/',

  '/components/hoc/',

  '/pages/_error.js'
]

module.exports = withConfig({
  webpack(config, {dev, isServer}) {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.shared = {
        name: 'commons',
        test: m => m.resource && commonModules.some(c =>
          m.resource.startsWith(join(__dirname, c))
        )
      }

      config.plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: false,
        reportFilename: join(__dirname, 'reports/bundles.html'),
        defaultSizes: 'gzip'
      }))
    }

    // Fix jsonlint error when importing mapbox-gl-draw
    // https://github.com/mapbox/mapbox-gl-draw/issues/626
    config.node = {...config.node, fs: 'empty'}

    return config
  }
})
