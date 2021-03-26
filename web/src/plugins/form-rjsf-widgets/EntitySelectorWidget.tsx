import React, { useState } from 'react'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import Modal from '../../components/modal/Modal'
import { BlueprintEnum } from '../../utils/variables'
import Tree from '../../components/tree-view/Tree'
import { IIndex, useIndex } from '../../context/index/IndexProvider'

export type Props = {
  onChange: Function
}

type Reference = {
  id: string
  name: string
  type: string
}

export default (props: Props) => {
  const { onChange } = props
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const index: IIndex = useIndex()

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
          type="string"
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
