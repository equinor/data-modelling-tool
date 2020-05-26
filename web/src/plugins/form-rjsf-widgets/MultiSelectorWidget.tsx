import React, { useEffect, useState } from 'react'
import { Datasource, DmtApi } from '../../api/Api'
import axios from 'axios'
import { TreeNodeRenderProps } from '../../components/tree-view/TreeNode'
import styled from 'styled-components'
import DocumentTree from '../../pages/common/tree-view/DocumentTree'
import Modal from '../../components/modal/Modal'
import { FaTimes } from 'react-icons/fa'
import { BlueprintEnum } from '../../util/variables'
import { treeNodeClick } from '../../pages/common/nodes/DocumentNode'

const api = new DmtApi()

const NodeWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
`
const IconTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
`
const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`
const PackagesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`
const TableCell = styled.td`
  display: flex;
  border: 1px solid #cccccc;
  padding: 2px 5px;
`

const BlueButton = styled.button`
  font-size: 24px;
  min-width: 60px;
  height: 30px;
  color: white;
  background: #45c0dc;
  font-weight: bold;
  border: none;
  border-radius: 4px;
`

type MultiSelectorProps = {
  onChange: Function
  formData: any
  uiSchema: any
  typeFilter: Function
}

const MultiSelector = ({
  onChange,
  formData,
  uiSchema,
  typeFilter,
}: MultiSelectorProps) => {
  let initialState = formData
  if (!Array.isArray(formData)) {
    initialState = [formData]
  }

  const [datasources, setDatasources] = useState<Datasource[]>([])
  const [selectedPackages, setSelectedPackages] = useState<string[]>(
    initialState
  )
  const [showModal, setShowModal] = useState<boolean>(false)

  function removePackage(value: string) {
    const newSelectedPackages = selectedPackages.filter(e => {
      return e !== value
    })
    setSelectedPackages(newSelectedPackages)
    onChange(newSelectedPackages)
  }

  function handleChange(value: string) {
    if (selectedPackages.includes(value)) {
      setSelectedPackages(selectedPackages.filter(e => e !== value))
      onChange(selectedPackages)
    } else {
      selectedPackages.push(value)
      setSelectedPackages(selectedPackages)
      onChange(selectedPackages)
    }
  }

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

  const tableRows = selectedPackages.map(folder => (
    <tr key={folder} style={{ verticalAlign: 'baseline' }}>
      <TableCell>
        {folder}
        <ButtonWrapper
          onClick={() => removePackage(folder)}
          style={{ marginLeft: '10px' }}
        >
          <FaTimes style={{ color: '#E15353' }} />
        </ButtonWrapper>
      </TableCell>
    </tr>
  ))
  return (
    <PackagesWrapper>
      <div style={{ flexDirection: 'column' }}>
        <b>{uiSchema['ui:label']}</b>
        <p>{uiSchema['ui:description']}</p>
        <table>
          <tbody>
            {(tableRows.length === 0 && (
              <tr key={'none'}>
                <TableCell>none</TableCell>
              </tr>
            )) ||
              tableRows}
          </tbody>
        </table>
      </div>
      <ButtonWrapper>
        {/* Need to override the "type" or else rjsf will treat it as a "submit" button */}
        <BlueButton
          type={'button'}
          onClick={() => {
            setShowModal(true)
          }}
        >
          +
        </BlueButton>
      </ButtonWrapper>
      <Modal
        toggle={() => setShowModal(!showModal)}
        open={showModal}
        title={'Select packages to include'}
      >
        <DocumentTree
          render={(renderProps: TreeNodeRenderProps) => {
            const { nodeData, actions } = renderProps
            const value = `${renderProps.path}/${nodeData.title}`

            return (
              <NodeWrapper>
                <IconTitleWrapper
                  onClick={() => {
                    treeNodeClick({
                      indexUrl: nodeData.meta.indexUrl,
                      node: { actions, nodeData },
                      setLoading: () => {},
                    })
                  }}
                >
                  {renderProps.iconGroup(() => {})}
                  {nodeData.title}
                </IconTitleWrapper>
                {typeFilter(nodeData) && (
                  <input
                    type={'checkbox'}
                    checked={selectedPackages.includes(value) || false}
                    readOnly={true}
                    value={value}
                    onClick={() => handleChange(value)}
                  />
                )}
              </NodeWrapper>
            )
          }}
          dataSources={datasources}
        />
      </Modal>
    </PackagesWrapper>
  )
}

export const PackagesSelector = ({ onChange, formData, uiSchema }: any) => {
  function PackageFilter(nodeData: any) {
    return nodeData.meta?.isRootPackage
  }
  return MultiSelector({
    onChange,
    formData,
    uiSchema,
    typeFilter: PackageFilter,
  })
}

export const BlueprintsSelector = ({ onChange, formData, uiSchema }: any) => {
  function BlueprintsFilter(nodeData: any) {
    return nodeData?.meta?.type === BlueprintEnum.BLUEPRINT
  }

  return MultiSelector({
    onChange,
    formData,
    uiSchema,
    typeFilter: BlueprintsFilter,
  })
}
