import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import axios from 'axios'
import Form from '../../../components/Form'
import Modal from '../../../components/modal/Modal'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { DmtApi } from '../../../api/Api'
import FileUpload from './FileUpload'
const api = new DmtApi()
const datasourcesOptions = [
  { label: '', templateUrl: '' },
  { label: 'local files', templateUrl: '' },
  {
    fetchSchema: api.templatesDatasourceMongoGet(),
    label: 'mongo db',
  },
]

export default (props: any) => {
  const { state, dispatch } = props
  const [showModal, setShowModal] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState(0)

  const fetchSchema = datasourcesOptions[selectedTemplate].fetchSchema
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
        {fetchSchema && (
          <Form
            schemaUrl={api.templatesDatasourceMongoGet()}
            dataUrl=""
            onSubmit={formData => {
              console.log(formData)
              axios
                .post(api.dataSourcesPost(), formData)
                .then((res: any) => {
                  NotificationManager.success(
                    'created datasource' + formData.name
                  )
                  console.log(res)
                  //@todo fix when endpoint is ready.
                  // dispatch(EntitiesActions.addDatasource(res.data))
                })
                .catch(e => {
                  NotificationManager.error('failed to create datasource')
                  console.log(e)
                })
            }}
          />
        )}
        {selectedTemplate === 1 && (
          <FileUpload state={state} dispatch={dispatch} />
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
