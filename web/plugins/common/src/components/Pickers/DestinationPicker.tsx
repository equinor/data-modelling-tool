// @ts-ignore
import React, { useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import styled from 'styled-components'
import {
  Application,
  DataSourceAPI,
  IIndex,
  Modal,
  Tree,
  TreeNodeRenderProps,
  useDataSources,
  useIndex,
} from '../../'
import { IDataSources } from '../../hooks/useDataSources'

const SelectDestinationButton = styled.button`
  padding: 0 2.5px;
  background-color: whitesmoke;
  outline: 0;
  border: 2px solid #2085e7;
  border-radius: 5px;

  &:hover {
    background-color: #d4d2d2;
  }

  &:active {
    background-color: darken(gray, 10);
  }
`

export type DestinationPickerProps = {
  onChange: (value: any) => void
  formData: any
  blueprintFilter?: BlueprintEnum
  title?: string
}

export const DestinationPicker = (props: DestinationPickerProps) => {
  const {
    onChange,
    formData,
    blueprintFilter = BlueprintEnum.PACKAGE,
    title = 'Destination',
  } = props
  const [destination, setDestination] = useState<string>(formData)
  const [showModal, setShowModal] = useState<boolean>(false)

  const dataSourceAPI = new DataSourceAPI()
  const dataSources: IDataSources = useDataSources(dataSourceAPI)
  const index: IIndex = useIndex({
    application: Application.BLUEPRINTS,
    dataSources: dataSources.models.dataSources,
  })

  const handleOpenOrExpand = (props: any) => {
    index.operations.toggle(props.nodeData.nodeId)
  }

  const onSelect = (nodeId: string, nodePath: string) => {
    const dataSource = nodePath.split('/', 1)[0]
    setDestination(nodePath)
    setShowModal(false)
    if (blueprintFilter === BlueprintEnum.ENUM) {
      onChange(nodePath)
    } else {
      onChange(dataSource + '/' + nodeId)
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
          <Tree
            state={index.models.tree.models.tree}
            operations={index.models.tree.operations}
          >
            {(renderProps: TreeNodeRenderProps) => {
              const { actions, nodeData } = renderProps
              const type = nodeData.meta.type

              return (
                <div style={{ display: 'flex' }}>
                  {renderProps.iconGroup(() => {
                    handleOpenOrExpand(renderProps)
                  })}
                  <div onClick={() => handleOpenOrExpand(renderProps)}>
                    {nodeData.title}
                    {nodeData.isLoading && (
                      <small style={{ paddingLeft: '15px' }}>Loading...</small>
                    )}
                  </div>
                  {type === blueprintFilter && (
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        flexFlow: 'row-reverse',
                      }}
                    >
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
                    </div>
                  )}
                </div>
              )
            }}
          </Tree>
        </Modal>
      </div>
    </>
  )
}
