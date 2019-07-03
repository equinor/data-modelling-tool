import React from 'react'
import Tree from '../../components/Tree'

export default props => {
  const { data, dispatch } = props
  return (
    <div>
      <h3>Blue print</h3>
      <Tree data={data} dispatch={dispatch} onSelect={() => {}} />
    </div>
  )
}
