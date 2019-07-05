import React from 'react'
import Tree from '../../components/Tree'
import Header from '../../components/Header'
import { Actions } from '../../components/tree-view/TreeReducer'

export default props => {
  const { dispatch } = props

  const addRootPackage = () => {
    let name = prompt('Please enter name of new package', 'New Package')
    const newRootPath = `/${name}`
    dispatch(Actions.addRootPackage(newRootPath))
  }

  return (
    <React.Fragment>
      <Header>
        <h3>Models</h3>
        <div>
          <button disabled onClick={() => addRootPackage()}>
            New Package
          </button>
        </div>
      </Header>
      <Tree onSelect={() => {}} {...props} />
    </React.Fragment>
  )
}
