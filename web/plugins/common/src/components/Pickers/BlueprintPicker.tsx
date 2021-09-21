// @ts-ignore
import React, { useContext, useState } from 'react'
import { BlueprintEnum } from '../../utils/variables'
import {
  ApplicationContext,
  DmssAPI,
  IIndex,
  Modal,
  Tree,
  TreeNodeRenderProps,
  useDataSources,
  useIndex,
} from '../../'
import { IDataSources } from '../../hooks/useDataSources'
import { AuthContext } from '../../../../../app/src/context/auth/AuthContext'

export type BlueprintPickerProps = {
  onChange: Function
  formData: any
  uiSchema: any
  blueprintFilter?: BlueprintEnum
}

export const Selector = ({ setShowModal, onChange, blueprintFilter }: any) => {
  const { token } = useContext(AuthContext)
  const dmssApi = new DmssAPI(token)
  const dataSources: IDataSources = useDataSources(dmssApi)
  const application = useContext(ApplicationContext)
  const index: IIndex = useIndex({
    dataSources: dataSources.models.dataSources,
    application,
  })

  const handleOpenOrExpand = (props: any) => {
    index.operations.toggle(props.nodeData.nodeId)
  }

  const onSelect = (value: string) => {
    setShowModal(false)
    onChange(value)
  }
  return (
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
            <div
              onClick={() => handleOpenOrExpand(renderProps)}
              style={{ display: 'flex', flexDirection: 'row' }}
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
  )
}

export const BlueprintPicker = (props: BlueprintPickerProps) => {
  const {
    onChange,
    formData,
    uiSchema,
    blueprintFilter = BlueprintEnum.BLUEPRINT,
  } = props
  const [showModal, setShowModal] = useState<boolean>(false)

  const selectorProps = {
    setShowModal,
    onChange,
    blueprintFilter,
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
          style={{ width: '280px', borderRadius: '5px' }}
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
          <Selector {...selectorProps} />
        </Modal>
      </div>
    </>
  )
}
