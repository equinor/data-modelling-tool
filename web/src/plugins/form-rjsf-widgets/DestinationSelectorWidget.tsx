import React, { useEffect, useState } from 'react'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import Modal from '../../components/modal/Modal'
import DocumentTree from '../../pages/common/tree-view/DocumentTree'
import { BlueprintEnum } from '../../util/variables'
import { Datasource } from '../../api/Api'
import styled from 'styled-components'
import { DataSourceAPI } from '../../api/Api3'
import { treeNodeClick } from '../../pages/common/nodes/DocumentNode'

const SelectDestinationButton = styled.button`
  padding: 0 2.5px;
  background-color: whitesmoke;
  outline: 0;
  border: 2px solid #2085e7;
  border-radius: 5px;
  &:hover {
    background-color: #d4d2d2;
  }

  &:active {
    background-color: darken(gray, 10);
  }
`

export type Props = {
  onChange: (value: any) => void
  formData: any
  blueprintFilter?: BlueprintEnum
  title?: string
}

export default (props: Props) => {
  const {
    onChange,
    formData,
    blueprintFilter = BlueprintEnum.PACKAGE,
    title = 'Destination',
  } = props
  const [destination, setDestination] = useState<string>(formData)
  const [datasources, setDatasources] = useState<Datasource[]>([])
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

  const onSelect = (nodeId: string, nodePath: string) => {
    const dataSource = nodePath.split('/', 1)[0]
    setDestination(nodePath)
    setShowModal(false)
    if (blueprintFilter === BlueprintEnum.ENUM) {
      onChange(nodePath)
    } else {
      onChange(dataSource + '/' + nodeId)
    }
  }

  return (
    <>
      <b>{title}</b>
      <div>
        <input
          style={{ width: '100%' }}
          type="string"
          value={destination}
          readOnly={true}
          onClick={() => setShowModal(true)}
        />
        <Modal
          toggle={() => setShowModal(!showModal)}
          open={showModal}
          title={'Select a folder as destination'}
        >
          <DocumentTree
            render={(renderProps: TreeNodeRenderProps) => {
              const [loading, setLoading] = useState(false)
              const { actions, nodeData } = renderProps
              const type = nodeData.meta.type

              return (
                <div style={{ display: 'flex' }}>
                  {renderProps.iconGroup(() => {
                    treeNodeClick({
                      indexUrl: nodeData.meta.indexUrl,
                      node: { actions, nodeData },
                      setLoading,
                    })
                  })}
                  <div
                    onClick={() =>
                      treeNodeClick({
                        indexUrl: nodeData.meta.indexUrl,
                        node: { actions, nodeData },
                        setLoading,
                      })
                    }
                  >
                    {nodeData.title}
                    {loading && (
                      <small style={{ paddingLeft: '15px' }}>Loading...</small>
                    )}
                  </div>
                  {type === blueprintFilter && (
                    <div
                      style={{
                        display: 'flex',
                        width: '100%',
                        flexFlow: 'row-reverse',
                      }}
                    >
                      <SelectDestinationButton
                        onClick={() => {
                          onSelect(
                            nodeData.nodeId,
                            `${renderProps.path}/${nodeData.title}`
                          )
                        }}
                      >
                        Select
                      </SelectDestinationButton>
                    </div>
                  )}
                </div>
              )
            }}
            dataSources={datasources}
          />
        </Modal>
      </div>
    </>
  )
}
