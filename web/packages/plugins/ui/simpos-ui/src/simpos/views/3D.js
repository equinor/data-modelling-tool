/**
 * Work space for attaching plugin to the dmt tool.
 * External dependencies:
 * - option1: should either be provided by the DMT (in package.json)
 * - option2: create a lib folder and add transpiled javascript files. Similar to dist folders in node_modules.
 *
 * External plugins must have a unique name, not conflicting with the DMT official plugin names.
 */

//********************************************************//

const Sce3DView = ({ parent, document, children }) => {
  console.log(document)

  return (
    <>
      <div>3d viewer</div>
      <div style={{ display: 'flex', alignItems: 'top' }}>
        <div style={{ display: 'inline-flex' }}>
          <OBJModel
            width={600}
            height={600}
            src="./AasgardPlatform.obj"
            texPath=""
          />
        </div>
      </div>
    </>
  )

  //return "hello";
  // return(
  //   <div>
  //     <OBJModel
  //       width="400" height="400"
  //       position={{x:0,y:0.0,z:0}}
  //       src="./platform.obj"
  //       onLoad={()=>{
  //         //...
  //       }}
  //       onProgress={xhr=>{
  //         //...
  //       }}
  //     />
  //   </div>
  // )
}
//********************************************************//
//********************************************************//

export { Sce3DView as SimposSce3DView }
