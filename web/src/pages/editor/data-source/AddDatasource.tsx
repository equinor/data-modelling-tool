import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import Form from '../../../components/Form'
import Modal from '../../../components/modal/Modal'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import DatasourceTypeSelect from './DatasourceTypeSelect'
import Button from '../../../components/Button'
import Api2 from '../../../api/Api2'
import { dmssApi } from '../../../services/api/configs/StorageServiceAPI'

export default () => {
  const [showModal, setShowModal] = useState(false)
  const [selectedDatasourceType, setSelectedDatasourceType] = useState(
    'mongo-db'
  )

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
        <Form
          fetchDocument={Api2.fetchCreateDatasource(selectedDatasourceType)}
          onSubmit={data => {
            data.type = selectedDatasourceType
            dmssApi
              .dataSourceSave({
                dataSourceId: data.name,
                dataSourceRequest: data,
              })
              .then(() => {
                NotificationManager.success(`Created datasource ${data.name}`)
                setShowModal(false)
                //@todo fix when endpoint is ready.
                // dispatch(EntitiesActions.addDatasource(res.data))
              })
              .catch(e => {
                NotificationManager.error(
                  `Failed to create datasource ${data.name}`
                )
                console.log(e)
              })
          }}
        />
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
