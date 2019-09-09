import { Datasource, DmtApi, IndexNode } from '../../api/Api'
import { DocumentsAction } from '../common/DocumentReducer'
import React, { useEffect } from 'react'
import axios from 'axios'
import Header from '../../components/Header'
import DocumentTree from '../common/tree-view/DocumentTree'
import { RootFolderNode } from './nodes/RootFolderNode'
import { FolderNode } from './nodes/FolderNode'
import { EntityNode } from './nodes/EntityNode'
const api = new DmtApi()

type Props = {
  datasource: Datasource | undefined
  datasources: Datasource[]
  dispatch: (action: DocumentsAction) => void
}

export default (props: Props) => {
  const { datasource, dispatch } = props
  const datasourceId = (datasource && datasource.id) || undefined
  useEffect(() => {
    if (datasourceId) {
      const url = api.indexGet(datasourceId)
      axios
        .get(url)
        .then((res: any) => {
          // setIndex(res.data)
        })
        .catch((err: any) => {
          console.error(err)
        })
    }
  }, [datasourceId])

  if (!datasource) {
    return null
  }
  return (
    <div>
      <Header>
        <div>{datasource.name}</div>
      </Header>
      <DocumentTree
        state={null}
        dispatch={dispatch}
        onNodeSelect={() => {}}
        datasource={datasource}
        getNodeComponent={getNodeComponent}
      />
    </div>
  )
}

function getNodeComponent(node: IndexNode) {
  switch (node.nodeType) {
    case 'folder':
      if (node.isRoot) {
        return RootFolderNode
      } else {
        return FolderNode
      }
    case 'file':
      return EntityNode
    default:
      return () => <div>{node.title}</div>
  }
}
