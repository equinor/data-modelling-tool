import React, { useEffect, useState } from 'react'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import Modal from '../../components/modal/Modal'
import { Datasource } from '../../api/Api'
import DocumentTree from '../../pages/common/tree-view/DocumentTree'
import { BlueprintEnum } from '../../util/variables'
import { DataSourceAPI } from '../../api/Api3'

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
  const [datasources, setDatasources] = useState<Datasource[]>([])
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    DataSourceAPI.getAll()
      .then((res: any) => {
        const data: Datasource[] = res || []
        setDatasources(data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [])

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
          <DocumentTree
            render={(renderProps: TreeNodeRenderProps) => {
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
            dataSources={datasources}
          />
        </Modal>
      </div>
    </>
  )
}
