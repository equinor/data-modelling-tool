import React, { useContext, useState } from 'react'
import { FaPlus } from 'react-icons/fa'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import DatasourceTypeSelect from './DatasourceTypeSelect'
import { DmssAPI, Button, AuthContext, UiPluginContext } from '@dmt/common'
import { useModalContext } from '../../../context/modal/ModalContext'

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
  // @ts-ignore
  const { getUiPlugin } = useContext(UiPluginContext)
  const [selectedDatasourceType, setSelectedDatasourceType] = useState(
    'mongo-db'
  )

  const ExternalPlugin = getUiPlugin('default-form')

  const handleOnSubmit = (data: any) => {
    data.type = selectedDatasourceType
    dmssAPI
      .dataSourceSave({ dataSourceId: data.name, dataSourceRequest: data })
      .then(() => {
        NotificationManager.success(`Created datasource ${data.name}`)
        // @todo fix when endpoint is ready.
        // dispatch(EntitiesActions.addDatasource(res.data))
      })
      .catch((e: any) => {
        NotificationManager.error(`Failed to create datasource ${data.name}`)
        console.log(e)
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
