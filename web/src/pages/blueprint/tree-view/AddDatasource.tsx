import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import Form from '../../../components/Form'
import Modal from '../../../components/modal/Modal'

const datasourcesOptions = [
  { label: '', templateUrl: '' },
  {
    label: 'mongo db',
    templateUrl: '/api/templates/data-sources/mongodb.json',
  },
]

export default (props: any) => {
  const { state, dispatch } = props
  const [showModal, setShowModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(0)

  const templateUrl = datasourcesOptions[selectedTemplate].templateUrl
  console.log(templateUrl)
  return (
    <div>
      <Modal toggle={() => setShowModal(!showModal)} open={showModal}>
        <div style={{ padding: '10px 0' }}>
          <label>Datasource type: </label>
          <select
            value={selectedTemplate}
            onChange={e => {
              setSelectedTemplate(Number(e.target.value))
            }}
            style={{ margin: '0 10px' }}
          >
            {datasourcesOptions.map(
              (datasourceTemplate: any, index: number) => (
                <option key={index} value={index}>
                  {datasourceTemplate.label}
                </option>
              )
            )}
          </select>
        </div>
        {templateUrl && (
          <Form
            schemaUrl={templateUrl}
            dataUrl=""
            onSubmit={res => {
              console.log(res)
            }}
          />
        )}
      </Modal>
      <div style={{ fontWeight: 700, marginLeft: 10, marginBottom: 10 }}>
        {' '}
        Datasource:
        <FaPlus onClick={() => setShowModal(!showModal)} />
      </div>
    </div>
  )
}
