import React from 'react'
import FileUpload from '../../common/tree-view/FileUpload'
import styled from 'styled-components'
import { TreeNodeData } from '../../../components/tree-view/Tree'

type Props = {
  node: TreeNodeData
  state: any
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const DataSourceNode = (props: Props) => {
  const { node, state } = props

  return (
    <Wrapper>
      <div>{node.title}</div>
      <div>
        {node.nodeId === 'local' && (
          <FileUpload state={state} datasource={state.dataSources[0]} />
        )}
      </div>
    </Wrapper>
  )
}
