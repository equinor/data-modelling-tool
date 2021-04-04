// @ts-ignore
import React, { useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import { Application, DataSourceAPI, IIndex, Modal, Tree, TreeNodeRenderProps, useDataSources, useIndex } from '../../'
import { IDataSources } from '../../hooks/useDataSources'


export type EntityPickerProps = {
  onChange: Function
}

type Reference = {
  id: string
  name: string
  type: string
}

export const EntityPicker = (props: EntityPickerProps) => {
  const { onChange } = props
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const dataSourceAPI = new DataSourceAPI()
  const dataSources : IDataSources = useDataSources(dataSourceAPI)
  const index: IIndex = useIndex({
    application: Application.ENTITIES,
    dataSources: dataSources.models.dataSources,
  })

  const onSelect = (value: Reference) => {
    setSelectedEntity(value.name)
    setShowModal(false)
    onChange(value)
  }

  return (
    <>
      <b>Select Entity</b>
      <div>
        <input
          style={{ width: '100%' }}
          type='string'
          value={selectedEntity}
          readOnly={true}
          onClick={() => setShowModal(true)}
        />
        <Modal
          toggle={() => setShowModal(!showModal)}
          open={showModal}
          title={'Select an Entity'}
        >
          <Tree
            state={index.models.tree.models.tree}
            operations={index.models.tree.operations}
          >
            {(renderProps: TreeNodeRenderProps) => {
              const { nodeData } = renderProps
              const reference: Reference = {
                name: nodeData.title,
                type: nodeData.meta.type,
                // id: `${nodeData.meta.dataSource}/${nodeData.nodeId}`,
                id: `${nodeData.nodeId}`,
              }

              return (
                <>
                  {/*TODO: use NodeType for something useful*/}
                  {![
                    BlueprintEnum.PACKAGE,
                    'datasource',
                    BlueprintEnum.BLUEPRINT,
                    BlueprintEnum.ENUM,
                  ].includes(nodeData.meta.type) ? (
                    <div
                      onClick={() => {
                        onSelect(reference)
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
          </Tree>
        </Modal>
      </div>
    </>
  )
}
