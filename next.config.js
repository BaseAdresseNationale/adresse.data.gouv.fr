const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

module.exports = withBundleAnalyzer({
  webpack(config, {dev, isServer}) {
    // eslint-disable-next-line import/no-extraneous-dependencies
    const {ContextReplacementPlugin} = require('webpack')

    config.plugins.push(
      new ContextReplacementPlugin(/moment[/\\]locale$/, /fr/)
    )

    return config
  }
})
