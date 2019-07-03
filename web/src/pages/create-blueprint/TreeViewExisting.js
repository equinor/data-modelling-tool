import React from 'react'
import Tree from '../../components/Tree'

export default props => {
  const { data, dispatch } = props
  return (
    <div>
      <h3>Models</h3>
      <Tree
        createPackage={true}
        data={data}
        dispatch={dispatch}
        onSelect={() => {}}
      />
    </div>
  )
}
