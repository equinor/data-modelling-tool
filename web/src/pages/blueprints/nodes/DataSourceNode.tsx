import React from 'react'
import { IndexNode } from '../../../api/Api'
import FileUpload from '../../common/tree-view/FileUpload'
import Header from '../../../components/Header'
import styled from 'styled-components'

type Props = {
  node: IndexNode
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
        {node.id === 'local' && (
          <FileUpload state={state} datasource={state.dataSources[0]} />
        )}
      </div>
    </Wrapper>
  )
}
