import React, { useContext, useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import {
  ApplicationContext,
  DmssAPI,
  IIndex,
  Modal,
  Tree,
  TreeNodeData,
  TreeNodeRenderProps,
  TReference,
  useDataSources,
  useIndex,
} from '../../index'
import { IDataSources } from '../../hooks/useDataSources'
import { AuthContext } from '@dmt/common'
import { Input } from '@equinor/eds-core-react'

export const EntityPicker = (props: {
  onChange: (ref: TReference) => void
  formData?: TReference
}) => {
  // TODO: Valid types should be passed to this, and filtered for in the view
  const { onChange, formData } = props
  const [showModal, setShowModal] = useState<boolean>(false)
  // @ts-ignore-line
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const dataSources: IDataSources = useDataSources(dmssAPI)
  const application = useContext(ApplicationContext)
  const index: IIndex = useIndex({
    dataSources: dataSources.models.dataSources,
    application,
  })
  const handleOpenOrExpand = (props: any) => {
    index.operations.toggle(props.nodeData.nodeId)
  }

  const onSelect = (nodeData: TreeNodeData) => {
    setShowModal(false)
    onChange({
      name: nodeData.title,
      type: nodeData.meta.type,
      _id: nodeData.nodeId,
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <Input
        type="string"
        value={formData?.name || formData?._id || ''}
        placeholder="Select"
        onClick={() => setShowModal(true)}
        style={{ width: '280px', margin: '0 8px', cursor: 'pointer' }}
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

            if (nodeData.meta.type !== BlueprintEnum.PACKAGE) {
              const onClick = () => {
                onSelect(nodeData)
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
