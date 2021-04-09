import React, { useState } from 'react'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import Modal from '../../components/modal/Modal'
import { BlueprintEnum } from '../../utils/variables'
import Tree from '../../components/tree-view/Tree'

import { IIndex, useIndex } from '../../hooks/useIndex'
import {
  IDashboard,
  useDashboard,
} from '../../context/dashboard/DashboardProvider'

export type Props = {
  onChange: Function
  formData: any
  uiSchema: any
  blueprintFilter?: BlueprintEnum
}

export default (props: Props) => {
  const {
    onChange,
    formData,
    uiSchema,
    blueprintFilter = BlueprintEnum.BLUEPRINT,
  } = props
  const [showModal, setShowModal] = useState<boolean>(false)
  const dashboard: IDashboard = useDashboard()
  const index: IIndex = useIndex({
    application: dashboard.models.application,
    dataSources: dashboard.models.dataSources.models.dataSources,
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
          type="string"
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
                      handleOpenOrExpand(renderProps)
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
