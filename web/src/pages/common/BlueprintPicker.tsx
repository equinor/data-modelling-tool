import React, { useEffect, useState } from 'react'
import { Datasource, DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import DocumentTree from './tree-view/DocumentTree'
import { NodeType } from '../../api/types'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'

const api = new DmtApi()

type BlueprintPickerContentProps = {
  onSelect: Function
}

export const BlueprintPickerContent = ({
  onSelect,
}: BlueprintPickerContentProps) => {
  const [blueprintDatasources, setBlueprintDatasources] = useState<
    Datasource[]
  >([])

  // fetch blueprints
  useEffect(() => {
    const url = api.dataSourcesGet(DataSourceType.Blueprints)
    axios
      .get(url)
      .then((res: any) => {
        const data: Datasource[] = res.data || []
        setBlueprintDatasources(data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [])
  return (
    <DocumentTree
      render={(renderProps: TreeNodeRenderProps) => {
        const { nodeData } = renderProps
        if (nodeData.nodeType === NodeType.DOCUMENT_NODE) {
          return (
            <div
              onClick={() => {
                onSelect(renderProps)
              }}
            >
              {nodeData.title}
            </div>
          )
        }
        // all other nodes should not have context menu.
        return <div>{nodeData.title}</div>
      }}
      dataSources={blueprintDatasources}
    />
  )
}
