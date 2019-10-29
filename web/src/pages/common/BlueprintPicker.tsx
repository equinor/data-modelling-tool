import React, { useEffect, useState } from 'react'
import { Datasource, DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import DocumentTree from './tree-view/DocumentTree'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import { BlueprintType } from '../../util/variables'

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
        // @ts-ignore
        const type = nodeData.meta.type
        return (
          <>
            {type === BlueprintType.BLUEPRINT ? (
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
    />
  )
}
