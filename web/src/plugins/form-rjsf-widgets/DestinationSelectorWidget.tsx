import React, { useEffect, useState } from 'react'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import Modal from '../../components/modal/Modal'
import DocumentTree from '../../pages/common/tree-view/DocumentTree'
import { BlueprintEnum, NodeType } from '../../util/variables'
import { Datasource, DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
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

export type Props = {
  onChange: (value: any) => void
  formData: any
  blueprintFilter?: BlueprintEnum
  datasourceType?: DataSourceType
  title?: string
}

export default (props: Props) => {
  const {
    onChange,
    formData,
    blueprintFilter = BlueprintEnum.PACKAGE,
    datasourceType = DataSourceType.Entities,
    title = 'Destination',
  } = props
  const [destination, setDestination] = useState<string>(formData)
  const [datasources, setDatasources] = useState<Datasource[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    const url = api.dataSourcesGet(datasourceType)
    axios
      .get(url)
      .then((res: any) => {
        const data: Datasource[] = res.data || []
        setDatasources(data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [])

  const onSelect = (nodeId: string, nodePath: string) => {
    setDestination(nodePath)
    setShowModal(false)
    if (blueprintFilter === BlueprintEnum.ENUM) {
      onChange(nodePath)
    } else {
      onChange(nodeId)
    }
  }

  return (
    <>
      <b>{title}</b>
      <div>
        <input
          style={{ width: '100%' }}
          type="string"
          value={destination}
          readOnly={true}
          onClick={() => setShowModal(true)}
        />
        <Modal
          toggle={() => setShowModal(!showModal)}
          open={showModal}
          title={'Select a folder as destination'}
        >
          <DocumentTree
            render={(renderProps: TreeNodeRenderProps) => {
              const { nodeData } = renderProps
              const type = nodeData.meta.type
              return (
                <NodeWrapper>
                  {nodeData.title}
                  {type === blueprintFilter && (
                    <SelectDestinationButton
                      onClick={() => {
                        onSelect(
                          nodeData.nodeId,
                          `${renderProps.path}/${nodeData.title}`
                        )
                      }}
                    >
                      Select
                    </SelectDestinationButton>
                  )}
                </NodeWrapper>
              )
            }}
            dataSources={datasources}
          />
        </Modal>
      </div>
    </>
  )
}
