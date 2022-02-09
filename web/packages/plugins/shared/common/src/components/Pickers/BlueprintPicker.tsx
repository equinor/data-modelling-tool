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
} from '../../index'
import { IDataSources } from '../../hooks/useDataSources'
import { AuthContext } from '@dmt/common'
import { Input } from '@equinor/eds-core-react'
import { FaSpinner } from 'react-icons/fa'
import styled from 'styled-components'
export type BlueprintPickerProps = {
  onChange: Function
  formData: any
  uiSchema?: any
  blueprintFilter?: BlueprintEnum
}

export const Spinner = styled(FaSpinner)`
  animation: spin infinite 1s linear;

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`

export const Selector = ({ setShowModal, onChange, blueprintFilter }: any) => {
  // @ts-ignore-line
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

  if (index.loading) {
    return <Spinner size="1.2em" />
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
  const selectorProps = { setShowModal, onChange, blueprintFilter }

  return (
    <>
      <div style={{ width: '100%' }}>
        <Input
          style={{ width: '280px', margin: '0 8px', cursor: 'pointer' }}
          type="string"
          value={formData}
          placeholder="Select"
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
