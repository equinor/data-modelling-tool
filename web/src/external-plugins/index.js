/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

const TestPlugin = ({ parent, document, children }) => {
  return 'test plugin'
}

const registeredPlugins = {
  'My plugin': TestPlugin,
}

export default function pluginHook(uiRecipe) {
  return registeredPlugins[uiRecipe.name]
}
