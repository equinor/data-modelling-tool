// @ts-ignore
import React, { useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import { DataSourceAPI, Modal, Tree, TreeNodeRenderProps, useDataSources } from '../../'
import { IIndex, useIndex, Application} from '../../'
import { IDataSources } from '../../hooks/useDataSources'

export type BlueprintPickerProps = {
  onChange: Function
  formData: any
  uiSchema: any
  blueprintFilter?: BlueprintEnum
}

export const BlueprintPicker = (props: BlueprintPickerProps) => {
  const {
    onChange,
    formData,
    uiSchema,
    blueprintFilter = BlueprintEnum.BLUEPRINT,
  } = props
  const [showModal, setShowModal] = useState<boolean>(false)
  const dataSourceAPI = new DataSourceAPI()
  const dataSources : IDataSources = useDataSources(dataSourceAPI)
  const index: IIndex = useIndex({
    application: Application.BLUEPRINTS,
    dataSources: dataSources.models.dataSources,
  })

  const handleOpenOrExpand = (props: any) => {
    index.operations.toggle(props.nodeData.nodeId)
  }

  const onSelect = (value: string) => {
    setShowModal(false)
    onChange(value)
  }

  return (
    <>
      {uiSchema?.['ui:label'] == null ? (
        <label>Type</label>
      ) : (
        <b>{uiSchema['ui:label']}</b>
      )}
      <div style={{ width: '100%' }}>
        <input
          style={{ width: '100%', borderRadius: '5px' }}
          type='string'
          value={formData}
          readOnly={true}
          onClick={() => setShowModal(true)}
        />
        <Modal
          toggle={() => setShowModal(!showModal)}
          open={showModal}
          title={'Select a blueprint as type'}
        >
          <Tree
            state={index.models.tree.models.tree}
            operations={index.models.tree.operations}
          >
            {(renderProps: TreeNodeRenderProps) => {
              const { actions, nodeData } = renderProps

              if (nodeData.meta.type === blueprintFilter) {
                const onClick = () => {
                  onSelect(`${renderProps.path}/${nodeData.title}`)
                }
                return (
                  <div
                    style={{ display: 'flex', flexDirection: 'row' }}
                    onClick={onClick}
                  >
                    {renderProps.iconGroup(() => onClick())}
                    {nodeData.title}
                  </div>
                )
              } else {
                return (
                  <div style={{ display: 'flex', flexDirection: 'row' }}>
                    {renderProps.iconGroup(() =>
                      handleOpenOrExpand(renderProps),
                    )}
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
    </>
  )
}
