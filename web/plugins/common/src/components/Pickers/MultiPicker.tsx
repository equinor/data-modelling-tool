// @ts-ignore
import React, { useContext, useEffect, useState } from 'react'
import styled from 'styled-components'
import { FaTimes } from 'react-icons/fa'
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
import { AuthContext } from '@dmt/common'

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
  const [selectedPackages, setSelectedPackages] = useState<string[]>([])
  const [showModal, setShowModal] = useState<boolean>(false)
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
  useEffect(() => {
    setSelectedPackages(formData || [])
  }, [formData])

  function removePackage(value: string) {
    const newSelectedPackages = selectedPackages.filter((e: any) => {
      return e !== value
    })
    setSelectedPackages(newSelectedPackages)
    onChange(newSelectedPackages)
  }

  function handleChange(value: string) {
    if (selectedPackages.includes(value)) {
      setSelectedPackages(selectedPackages.filter((e: any) => e !== value))
      onChange(selectedPackages)
    } else {
      selectedPackages.push(value)
      setSelectedPackages(selectedPackages)
      onChange(selectedPackages)
    }
  }

  const tableRows = selectedPackages.map((folder: any) => (
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
        {uiSchema && (
          <>
            <b>{uiSchema['ui:label']}</b>
            <p>{uiSchema['ui:description']}</p>
          </>
        )}
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
        <Tree
          state={index.models.tree.models.tree}
          operations={index.models.tree.operations}
        >
          {(renderProps: TreeNodeRenderProps) => {
            const { nodeData } = renderProps
            const value = `${renderProps.path}/${nodeData.title}`

            return (
              <NodeWrapper>
                <IconTitleWrapper
                  onClick={() => handleOpenOrExpand(renderProps)}
                >
                  {renderProps.iconGroup(() => {
                    handleOpenOrExpand(renderProps)
                  })}
                  {nodeData.title}
                </IconTitleWrapper>
                {typeFilter(nodeData) && (
                  <TreeNodeSelector
                    value={value}
                    selectedPackages={selectedPackages}
                    handleChange={handleChange}
                  />
                )}
              </NodeWrapper>
            )
          }}
        </Tree>
      </Modal>
    </PackagesWrapper>
  )
}

const TreeNodeSelector = (props: any) => {
  const { value, selectedPackages, handleChange } = props
  const [checked, setChecked] = useState(
    selectedPackages.includes(value) || false
  )
  return (
    <input
      type={'checkbox'}
      checked={checked}
      readOnly={true}
      value={value}
      onClick={(e: any) => {
        setChecked(e.target.checked)
        handleChange(value)
      }}
    />
  )
}

export const PackagesPicker = ({ onChange, formData, uiSchema }: any) => {
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

export const BlueprintsPicker = ({ onChange, formData, uiSchema }: any) => {
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
