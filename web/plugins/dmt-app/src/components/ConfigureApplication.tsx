// @ts-nocheck
import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaChevronUp, FaCog, FaPlus } from 'react-icons/fa'
import styled from 'styled-components'
import { Modal, DmtAPI } from '@dmt/common'
import { BlueprintsPicker, PackagesPicker, BlueprintPicker } from '@dmt/common'

//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { cloneDeep } from 'lodash'

const ButtonWrapper = styled.div`
  display: flex;
  cursor: pointer;
  width: 30px;
  height: 30px;
  font-size: 15px;
  text-align: center;
  align-items: center;
  justify-content: center;

  &:hover {
    border: #666666 solid 1px;
    border-radius: 5px;
  }
`

const ActionWrapper = styled.div`
  border: 1px solid #282c34;
  border-radius: 5px;
  margin: 10px 0px;
  padding: 10px;
  background: #f6f3f3;
`

function Action({ value, index, onChange }) {
  const [collapsed, setCollapsed] = useState(true)

  if (collapsed) {
    return (
      <ActionWrapper
        style={{ cursor: 'pointer' }}
        onClick={() => setCollapsed(false)}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <label>{value.name}</label>
          <FaChevronDown />
        </div>
      </ActionWrapper>
    )
  } else {
    return (
      <ActionWrapper>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          onClick={() => setCollapsed(true)}
        >
          <label>Action #{index}</label>
          <div>
            <button
              onClick={() => onChange(null)}
              style={{ color: 'red', marginRight: '10px' }}
            >
              Remove
            </button>
            <FaChevronUp />
          </div>
        </div>
        <TextInput
          label={'Name'}
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e })}
        />
        <TextInput
          label={'Description'}
          value={value.description}
          onChange={(e) => onChange({ ...value, description: e })}
        />
        <TextInput
          label={'Method'}
          value={value.method}
          onChange={(e) => onChange({ ...value, method: e })}
        />
        <ActionTypesInput
          value={value.actionType}
          onChange={(e) => onChange({ ...value, actionType: e })}
        />
        <label style={{ padding: '5px' }}>{'Input type'}:</label>
        {/*
        // @ts-ignore */}
        <BlueprintPicker
          onChange={(e) => onChange({ ...value, input: e })}
          formData={value.input}
          uiSchema={{ 'ui:label': '' }}
        />
        <label style={{ padding: '5px' }}>{'Output type'}:</label>
        <BlueprintPicker
          onChange={(e) => onChange({ ...value, output: e })}
          formData={value.output}
          uiSchema={{ 'ui:label': '' }}
        />
      </ActionWrapper>
    )
  }
}

function TextInput({ label, value, onChange }) {
  return (
    <div>
      <label style={{ paddingRight: '5px' }}>{label}:</label>
      <input
        type={'text'}
        onChange={(e) => onChange(e.target.value)}
        value={value}
        style={{ width: '100%' }}
      />
    </div>
  )
}

function ActionTypesInput({ value, onChange }) {
  return (
    <div>
      <label style={{ paddingRight: '5px' }}>ActionType:</label>
      <select
        id={'actionTypes'}
        value={value}
        style={{ width: '100%' }}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value={'separateResultFile'} label={'Separate Result File'} />
        <option value={'resultInEntity'} label={'Result in entity'} />
      </select>
    </div>
  )
}

function PackageInput({ label, value, onChange }) {
  return (
    <>
      <label style={{ margin: '5px 0 0 0' }}>{label}:</label>
      <ActionWrapper style={{ background: 'white', margin: '0' }}>
        <PackagesPicker
          formData={value}
          onChange={(value) => onChange(value)}
        />
      </ActionWrapper>
    </>
  )
}

function ModelInput({ label, value, onChange }) {
  return (
    <>
      <label style={{ margin: '5px 0 0 0' }}>{label}:</label>
      <ActionWrapper style={{ background: 'white', margin: '0' }}>
        <BlueprintsPicker
          formData={value}
          onChange={(value) => onChange(value)}
        />
      </ActionWrapper>
    </>
  )
}

export default () => {
  const [modalOpen, setModalOpen] = useState(false)
  // Keep a copy of the original so we can 'reset'
  const [settings, setSettings] = useState({})
  const [newSettings, setNewSettings] = useState({})
  const dmtAPI = new DmtAPI()

  useEffect(() => {
    if (modalOpen) {
      dmtAPI
        .getSystemSettings()
        .then((result) => {
          setSettings(result.data)
          setNewSettings(cloneDeep(result.data))
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [modalOpen])

  function onChange(key, value) {
    setNewSettings({ ...newSettings, [key]: value })
  }

  function newAction() {
    let newActions = newSettings.actions
    newActions.push({
      name: 'none',
      description: '',
      method: 'none',
      input: '',
      output: '',
    })
    setNewSettings({ ...newSettings, actions: newActions })
  }

  function actionsOnChange(index, value) {
    // If empty, remove the element from the list
    if (!value) {
      let newActions = newSettings.actions
      newActions.splice(index, 1)
      setNewSettings({ ...newSettings, actions: newActions })
      return
    }
    let newActions = newSettings.actions
    newActions[index] = value
    setNewSettings({ ...newSettings, actions: newActions })
  }

  function saveSettings() {
    dmtAPI
      .postSystemSettings(newSettings)
      .then(async () => {
        NotificationManager.success('Reloading...', 'Settings updated.')
        // Add delay to user can read toast and feel some feedback
        await new Promise((r) => setTimeout(r, 2000))
        window.location.reload()
      })
      .catch((error) => NotificationManager.error(`${error.message}`))
  }

  return (
    <>
      <ButtonWrapper onClick={() => setModalOpen(!modalOpen)}>
        <FaCog />
      </ButtonWrapper>
      <Modal
        toggle={() => setModalOpen(!modalOpen)}
        open={modalOpen}
        title={'Configure Application'}
        width={'50%'}
      >
        <TextInput
          label={'Name'}
          value={newSettings.name}
          onChange={(value) => onChange('name', value)}
        />
        <TextInput
          label={'Description'}
          value={newSettings.description}
          onChange={(value) => onChange('description', value)}
        />
        <PackageInput
          label={'Entities'}
          value={newSettings.entities}
          onChange={(value) => onChange('entities', value)}
        />
        <PackageInput
          label={'Packages'}
          value={newSettings.packages}
          onChange={(value) => onChange('packages', value)}
        />
        <ModelInput
          label={'Models'}
          value={newSettings.models}
          onChange={(value) => onChange('models', value)}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '10px 0 0 0',
          }}
        >
          <label style={{ margin: '0 5px' }}>Actions:</label>
          <FaPlus style={{ cursor: 'pointer' }} onClick={() => newAction()} />
        </div>

        {newSettings.actions &&
          newSettings.actions.map((action, index) => {
            return (
              <Action
                value={action}
                onChange={(value) => actionsOnChange(index, value)}
                index={index + 1}
              />
            )
          })}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '20px',
          }}
        >
          <button type={'button'} onClick={() => setModalOpen(false)}>
            Close
          </button>
          <button
            type={'button'}
            onClick={() => setNewSettings(cloneDeep(settings))}
          >
            Reset
          </button>
          <button type={'button'} onClick={() => saveSettings()}>
            Save and Reload
          </button>
        </div>
      </Modal>
    </>
  )
}
