var path = require('path')

const {
  removeModuleScopePlugin,
  override,
  babelInclude,
} = require('customize-cra')

module.exports = function (config, env) {
  return Object.assign(
    config,
    override(
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
