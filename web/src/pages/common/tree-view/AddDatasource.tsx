import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import axios from 'axios'
import Form from '../../../components/Form'
import Modal from '../../../components/modal/Modal'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { DmtApi } from '../../../api/Api'
import DatasourceTypeSelect from './DatasourceTypeSelect'
import Button from '../../../components/Button'
import Api2 from '../../../api/Api2'
const api = new DmtApi()

export default () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedDatasourceType, setSelectedDatasourceType] = useState('')

  return (
    <div>
      <Modal
        toggle={() => setShowModal(!showModal)}
        open={showModal}
        title="Add Data Source"
      >
        <div style={{ padding: '10px 0' }}>
          <label>Datasource type: </label>
          <DatasourceTypeSelect
            selectedDatasourceType={selectedDatasourceType}
            setSelectedDatasourceType={setSelectedDatasourceType}
          />
        </div>
        {selectedDatasourceType === 'mongo-db' && (
          <Form
            fetchDocument={Api2.fetchCreateDatasource(
              selectedDatasourceType
            )}
            onSubmit={data => {
              axios
                .post(api.dataSourcesPost(), data)
                .then((res: any) => {
                  NotificationManager.success('created datasource' + data.name)
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
      <Button
        onClick={() => {
          setShowModal(!showModal)
        }}
      >
        <FaPlus onClick={() => setShowModal(!showModal)} />
        {`  `}
        Data Source
      </Button>
    </div>
  )
}
