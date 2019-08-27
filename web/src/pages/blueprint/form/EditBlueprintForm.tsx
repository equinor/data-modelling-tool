import React, { useEffect, useState } from 'react'
import BlueprintForm from './BlueprintForm'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { BlueprintState } from '../BlueprintReducer'
import { DmtApi } from '../../../api/Api'
const api = new DmtApi()
interface Props {
  state: BlueprintState
}

const EditBlueprintForm = (props: Props) => {
  const {
    state: { selectedBlueprintId, selectedDatasourceId },
  } = props
  const [formData, setFormData] = useState({})
  const [dataLoading, setDataLoading] = useState(false)
  // fetch data
  useEffect(() => {
    if (selectedBlueprintId) {
      setDataLoading(true)
      api
        .blueprintsGet(selectedDatasourceId, selectedBlueprintId)
        .then(res => {
          setFormData(res.data)
          setDataLoading(false)
        })
        .catch((err: any) => {
          setDataLoading(false)
          NotificationManager.error(``, 'Failed to fetch blueprint data')
        })
    }
  }, [selectedDatasourceId, selectedBlueprintId])

  if (dataLoading) {
    return <div>Loading...</div>
  }

  const onSubmit = (schemas: any) => {
    // const url = dataUrl
    //@todo use api.
    // axios
    //   .put(url, schemas.formData)
    //   .then(response => {
    //     NotificationManager.success(response.data, 'Updated blueprint')
    //   })
    //   .catch(e => {
    //     NotificationManager.error(
    //       'Failed to update blueprint',
    //       'Updated blueprint'
    //     )
    //   })
  }

  return (
    <>
      <h3>Edit Blueprint</h3>
      <BlueprintForm formData={formData} onSubmit={onSubmit} />
    </>
  )
}

export default EditBlueprintForm
