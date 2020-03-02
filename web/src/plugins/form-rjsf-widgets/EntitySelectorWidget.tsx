import React, { useEffect, useState } from 'react'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import Modal from '../../components/modal/Modal'
import { Datasource, DataSourceType, DmtApi } from '../../api/Api'
import DocumentTree from '../../pages/common/tree-view/DocumentTree'
import axios from 'axios'
import { BlueprintEnum } from '../../util/variables'

const api = new DmtApi()

export type Props = {
  onChange: Function
  formData: any
  uiSchema: any
}

type Reference = {
  id: string
  name: string
  type: string
}

export default (props: Props) => {
  const { onChange, formData, uiSchema } = props
  const [datasources, setDatasources] = useState<Datasource[]>([])
  const [selectedEntity, setSelectedEntity] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    const url = api.dataSourcesGet(DataSourceType.ALL)
    axios
      .get(url)
      .then((res: any) => {
        const data: Datasource[] = res.data || []
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
