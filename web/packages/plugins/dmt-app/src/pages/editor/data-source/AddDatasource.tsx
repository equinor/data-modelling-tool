import React, { useContext, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import DatasourceTypeSelect from './DatasourceTypeSelect'
import {
  DmssAPI,
  Button,
  AuthContext,
  UiPluginContext,
  ErrorResponse,
} from '@development-framework/dm-core'
import { useModalContext } from '../../../context/modal/ModalContext'
import { AxiosError } from 'axios'

const constructType = (selectedDatasourceType: string) => {
  let template = ''

  // TODO: Cleanup constants
  if (selectedDatasourceType === 'mongo-db') template = 'MongoDataSource'
  if (selectedDatasourceType === 'azure-blob-storage')
    template = 'AzureBlobStorageDataSource'

  return `apps/DMT/data-sources/${template}`.toString()
}

const AddDataSourceComponent = () => {
  const { token } = useContext(AuthContext)
  const dmssAPI = new DmssAPI(token)
  const { getUiPlugin } = useContext(UiPluginContext)
  const [selectedDatasourceType, setSelectedDatasourceType] = useState(
    'mongo-db'
  )

  const ExternalPlugin = getUiPlugin('form')

  const handleOnSubmit = (data: any) => {
    data.type = selectedDatasourceType
    dmssAPI
      .dataSourceSave({ dataSourceId: data.name, dataSourceRequest: data })
      .then(() => {
        NotificationManager.success(`Created datasource ${data.name}`)
        // @todo fix when endpoint is ready.
        // dispatch(EntitiesActions.addDatasource(res.data))
      })
      .catch((e: AxiosError<ErrorResponse>) => {
        console.error(e)
        NotificationManager.error(`Failed to create datasource ${data.name}`)
      })
  }

  return (
    <>
      <div style={{ padding: '10px 0' }}>
        <label>Datasource type: </label>
        <DatasourceTypeSelect
          selectedDatasourceType={selectedDatasourceType}
          setSelectedDatasourceType={setSelectedDatasourceType}
        />
        <ExternalPlugin
          type={constructType(selectedDatasourceType)}
          onSubmit={handleOnSubmit}
        />
      </div>
    </>
  )
}

export default () => {
  const { openModal } = useModalContext()

  const open = () => {
    const modalProps = {}
    openModal(AddDataSourceComponent, {
      dialog: { title: `Add data source` },
      props: modalProps,
    })
  }

  return (
    <div>
      <Button
        onClick={() => {
          open()
        }}
      >
        <FaPlus onClick={() => open()} />
        {`  `}
        Data Source
      </Button>
    </div>
  )
}
