const {join} = require('path')
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer')

const commonDependencies = [
  '/next/',
  '/lodash/',

  '/components/hoc/',

  '/pages/_error.js'
]

module.exports = {
  webpack(config, {dev, isServer}) {
    if (!dev && !isServer) {
      const commonPlugin = config.plugins.find(p =>
        p.constructor.name === 'CommonsChunkPlugin' && p.filenameTemplate === 'static/commons/main-[chunkhash].js'
      )

      if (commonPlugin) {
        const {minChunks} = commonPlugin

        commonPlugin.minChunks = (module, count) => {
          if (module.resource && commonDependencies.some(c => module.resource.includes(c))) {
            return true
          }

          return minChunks(module, count)
        }
      }

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
