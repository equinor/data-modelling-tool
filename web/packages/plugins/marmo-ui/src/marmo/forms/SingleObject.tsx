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

//****************************************************** */

const objForm = ({ document, updateEntity }) => {
  //console.log(document);

  return (
    <div className="container">
      <div className="container">
        <Form document={document} updateEntity={updateEntity} />
      </div>
    </div>
  )
}

//********************************************************//
//********************************************************//

export { objForm as SingleObjectForm }
