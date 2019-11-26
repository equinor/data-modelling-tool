import React, { useEffect, useState } from 'react'
import { Datasource, DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import DocumentTree from './tree-view/DocumentTree'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import { BlueprintEnum, NodeType } from '../../util/variables'
import styled from 'styled-components'

const api = new DmtApi()

const SelectDestinationButton = styled.button`
  padding: 2.5px;
  font-size: 0.8em;
  background-color: whitesmoke;
  outline: 0;
  @include transition(background-color 0.3s ease);
  border: 2px solid dodgerblue;
  border-radius: 6px;
  &:hover {
    background-color: gray;
  }

  &:active {
    background-color: darken(gray, 10);
  }
`

const NodeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`

export const FilePicker = ({ onSelect, packagesOnly }: any) => {
  const [blueprintDatasources, setBlueprintDatasources] = useState<
    Datasource[]
  >([])

  const dataSourcesType = packagesOnly
    ? DataSourceType.Entities
    : DataSourceType.Blueprints

  // fetch dataSources with index
  useEffect(() => {
    const url = api.dataSourcesGet(dataSourcesType)
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

        if (packagesOnly) {
          // @ts-ignore
          return (
            <NodeWrapper>
              {nodeData.title}
              {type === NodeType.PACKAGE && (
                <SelectDestinationButton
                  onClick={() => {
                    onSelect(renderProps)
                  }}
                >
                  Select
                </SelectDestinationButton>
              )}
            </NodeWrapper>
          )
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
    />
  )
}
