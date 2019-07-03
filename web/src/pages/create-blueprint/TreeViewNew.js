import React from 'react'
import Tree from '../../components/Tree'

export default props => {
  console.log(props.data)
  return (
    <div>
      <h3>Blue print</h3>
      <Tree {...props} onSelect={() => {}} />
    </div>
  )
}
