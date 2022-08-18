var path = require('path')
const webpack = require('webpack')

const ignoreWarnings = (value) => (config) => {
  config.ignoreWarnings = value
  return config
}

const {
  removeModuleScopePlugin,
  override,
  babelInclude,
} = require('customize-cra')

module.exports = function (config, env) {
  const fallback = config.resolve.fallback || {}
  Object.assign(fallback, {
    crypto: require.resolve('crypto-browserify'),
    stream: require.resolve('stream-browserify'),
    assert: require.resolve('assert'),
    http: require.resolve('stream-http'),
    https: require.resolve('https-browserify'),
    os: require.resolve('os-browserify'),
    url: require.resolve('url'),
    events: require.resolve('events-polyfill'),
  })
  config.resolve.fallback = fallback
  /*config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            // process: 'process/browser',
            // Buffer: ['buffer', 'Buffer']
        })
    ])*/

  return Object.assign(
    config,
    override(
      // ignoreWarnings([/Failed to parse source map/]),
      removeModuleScopePlugin(),
      babelInclude([
        /* transpile (converting to es5) code in src/ and shared component library */
        path.resolve('src'),
        path.resolve('../plugins'),
        path.resolve('../dmt-core/src'),
      ])
    )(config, env)
  )
}
