// @ts-ignore
import React, { useContext, useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import {
  ApplicationContext,
  DataSourceAPI,
  IIndex,
  Modal,
  Tree,
  TreeNodeRenderProps,
  useDataSources,
  useIndex,
} from '../../'
import { IDataSources } from '../../hooks/useDataSources'
import { Reference } from '../../services/api/configs/gen'

export type EntityPickerProps = {
  onChange: Function
}

export const EntityPicker = (props: EntityPickerProps) => {
  // TODO: Valid types should be passed to this, and filtered for in the view
  const { onChange } = props
  const [selectedEntity, setSelectedEntity] = useState<string>(
    'Click to select entity'
  )
  const [showModal, setShowModal] = useState<boolean>(false)
  const dataSourceAPI = new DataSourceAPI()
  const dataSources: IDataSources = useDataSources(dataSourceAPI)
  const application = useContext(ApplicationContext)
  const index: IIndex = useIndex({
    application: application,
    dataSources: dataSources.models.dataSources,
  })
  const handleOpenOrExpand = (props: any) => {
    index.operations.toggle(props.nodeData.nodeId)
  }

  const onSelect = (value: Reference) => {
    setSelectedEntity(value.id)
    setShowModal(false)
    onChange(value)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <input
        type="string"
        value={selectedEntity}
        readOnly={true}
        onClick={() => setShowModal(true)}
        style={{ width: '280px' }}
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
              id: nodeData.nodeId,
            }

            if (nodeData.meta.type !== BlueprintEnum.PACKAGE) {
              const onClick = () => {
                onSelect(reference)
              }
              return (
                <div
                  style={{ display: 'flex', flexDirection: 'row' }}
                  onClick={onClick}
                >
                  {renderProps.iconGroup(() => onClick)}
                  {nodeData.title}
                </div>
              )
            } else {
              return (
                <div
                  onClick={() => handleOpenOrExpand(renderProps)}
                  style={{
                    display: 'flex',
                  }}
                >
                  {renderProps.iconGroup(() => handleOpenOrExpand(renderProps))}
                  {nodeData.title}
                  {nodeData.isLoading && (
                    <small style={{ paddingLeft: '15px' }}>Loading...</small>
                  )}
                </div>
              )
            }
          }}
        </Tree>
      </Modal>
    </div>
  )
}
