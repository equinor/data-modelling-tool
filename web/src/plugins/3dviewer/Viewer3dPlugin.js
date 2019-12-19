import React from 'react'
import { OBJModel, JSONModel } from 'react-3d-viewer'

export const Viewer3dPlugin = props => {
  return (
    <>
      <div>3d viewer</div>
      <div style={{ display: 'flex', alignItems: 'top' }}>
        <div style={{ display: 'inline-flex' }}>
          <JSONModel width={200} height={200} src="./kapool.json" />
        </div>
        <div style={{ display: 'inline-flex' }}>
          <OBJModel width={600} height={600} src="./sample.obj" texPath="" />
        </div>
      </div>
    </>
  )
}
