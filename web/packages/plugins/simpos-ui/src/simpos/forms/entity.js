/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

//****************************************************** */

//****************************************************** */
class Entity {
  constructor(props) {
    this.document = props.document
  }

  handleChange(parents, state) {
    //console.log('** in entity handle change')
    //console.log(parents)
    //console.log(state)

    var doc = this.document
    for (var i = 0; i < parents.length; i++) {
      doc = doc[parents[i]]
    }

    doc[state.id] = state.value

    //console.log(this.document)
    //console.log('** in entity handle change')
  }
}
//****************************************************** */

//********************************************************//

export { Entity }
