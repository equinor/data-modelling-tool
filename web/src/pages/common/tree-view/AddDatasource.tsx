import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import axios from 'axios'
import Form from '../../../components/Form'
import Modal from '../../../components/modal/Modal'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { DmtApi } from '../../../api/Api'
const api = new DmtApi()
const datasourcesOptions = [
  { label: '', templateUrl: '' },
  {
    fetchSchema: api.templatesDatasourceMongoGet(),
    label: 'mongo db',
  },
]

export default (props: any) => {
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
              const data = {
                ...formData,
                documentType: props.documentType,
              }
              axios
                .post(api.dataSourcesPost(), data)
                .then((res: any) => {
                  NotificationManager.success(
                    'created datasource' + formData.name
                  )
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
      </Modal>
      <div style={{ fontWeight: 700, marginLeft: 10, marginBottom: 10 }}>
        {' '}
        Datasource:
        <FaPlus onClick={() => setShowModal(!showModal)} />
      </div>
    </div>
  )
}
