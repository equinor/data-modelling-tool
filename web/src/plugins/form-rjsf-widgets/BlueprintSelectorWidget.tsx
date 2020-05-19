import React, { useEffect, useState } from 'react'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import Modal from '../../components/modal/Modal'
import { Datasource, DmtApi } from '../../api/Api'
import DocumentTree from '../../pages/common/tree-view/DocumentTree'
import { BlueprintEnum } from '../../util/variables'
import axios from 'axios'
import { packageOnClick } from '../../pages/common/nodes/DocumentNode'

const api = new DmtApi()

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
  const [datasources, setDatasources] = useState<Datasource[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    const url = api.dataSourcesGet()
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

  const onSelect = (value: string) => {
    setShowModal(false)
    onChange(value)
  }

  return (
    <>
      <b>{uiSchema['ui:label']}</b>
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
          <DocumentTree
            render={(renderProps: TreeNodeRenderProps) => {
              const { actions, nodeData } = renderProps

              return (
                <>
                  {nodeData.meta.type === blueprintFilter ? (
                    <div
                      onClick={() => {
                        onSelect(`${renderProps.path}/${nodeData.title}`)
                      }}
                    >
                      {nodeData.title}
                    </div>
                  ) : (
                    <div
                      onClick={() =>
                        packageOnClick({
                          onSelect: nodeData.meta.onSelect,
                          node: { actions, nodeData },
                        })
                      }
                    >
                      {nodeData.title}
                    </div>
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
