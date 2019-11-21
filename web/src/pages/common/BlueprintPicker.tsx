import React, { useEffect, useState } from 'react'
import { Datasource, DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import DocumentTree from './tree-view/DocumentTree'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import { BlueprintEnum, NodeType } from '../../util/variables'

const api = new DmtApi()

export const FilePicker = ({ onSelect, packagesOnly }: any) => {
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
        // @ts-ignore
        const type = nodeData.meta.type
        console.log(type)

        if (packagesOnly) {
          // @ts-ignore
          return (
            <div>
              {nodeData.title}
              <button
                onClick={() => {
                  onSelect(renderProps)
                }}
              >
                Select
              </button>
            </div>
          )
          return
        }

        return (
          <>
            {type === BlueprintEnum.BLUEPRINT ? (
              <div
                onClick={() => {
                  onSelect(renderProps)
                }}
              >
                {nodeData.title}
              </div>
            ) : (
              <div>{nodeData.title}</div>
            )}
          </>
        )
      }}
      dataSources={blueprintDatasources}
      packagesOnly={packagesOnly}
    />
  )
}
