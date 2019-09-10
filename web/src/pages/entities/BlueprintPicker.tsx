import React, { useEffect, useState } from 'react'
import Modal from '../../components/modal/Modal'
import { Datasource, DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import { DocumentsState } from '../common/DocumentReducer'
import BlueprintPickerTree from './BlueprintPickerTree'
import DatasourceSelect from '../common/tree-view/DatasourceSelect'

const api = new DmtApi()

type Props = {
  state: any
  dispatch: any
}

export default (props: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <button onClick={() => setOpen(!open)}>Add blueprint</button>

      <Modal open={open} toggle={() => setOpen(!open)}>
        <BlueprintPickerContent {...props} />
      </Modal>
    </div>
  )
}

type BlueprintPickerContentProps = {
  state: DocumentsState
  dispatch: any
}

const BlueprintPickerContent = (props: BlueprintPickerContentProps) => {
  const { dispatch } = props
  const [selectedDatasourceId, setSelectedDatasourceId] = useState('')
  const [blueprintDatasources, setBlueprintDatasources] = useState([])

  // fetch blueprints
  useEffect(() => {
    const url = api.dataSourcesGet(DataSourceType.Blueprints)
    axios
      .get(url)
      .then((res: any) => {
        setBlueprintDatasources(res.data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [])
  const datasource: Datasource | undefined = blueprintDatasources.find(
    (d: Datasource) => d.id === selectedDatasourceId
  )
  return (
    <div>
      <DatasourceSelect
        selectedDatasource={selectedDatasourceId}
        setSelectedDatasource={setSelectedDatasourceId}
        datasources={blueprintDatasources}
      />
      <BlueprintPickerTree
        datasource={datasource}
        datasources={blueprintDatasources}
        dispatch={dispatch}
      />
    </div>
  )
}
