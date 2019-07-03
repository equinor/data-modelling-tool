import React from 'react'
import Tree from '../../components/Tree'

export default props => {
  return (
    <div>
      <h3>Models</h3>
      <Tree createPackage={true} onSelect={() => {}} {...props} />
    </div>
  )
}
