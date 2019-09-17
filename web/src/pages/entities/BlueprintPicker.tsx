import React, { useEffect, useState } from 'react'
import Modal from '../../components/modal/Modal'
import { Datasource, DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import { DocumentsState } from '../common/DocumentReducer'
import BlueprintPickerTree, { OnNodeSelect } from './BlueprintPickerTree'
import { TreeNodeData } from '../../components/tree-view/Tree'
import Button from '../../components/Button'

const api = new DmtApi()

type Props = {
  state: any
  dispatch: any
}

export default (props: Props) => {
  const [open, setOpen] = useState(false)
  return (
    <div>
      <Button onClick={() => setOpen(!open)}>Create Entity</Button>
      <Modal open={open} toggle={() => setOpen(!open)}>
        <BlueprintPickerContent
          {...props}
          onNodeSelect={(node: TreeNodeData) => {
            console.log(node)
          }}
        />
      </Modal>
    </div>
  )
}

type BlueprintPickerContentProps = {
  state: DocumentsState
  dispatch: any
  onNodeSelect: OnNodeSelect
}

export const BlueprintPickerContent = (props: BlueprintPickerContentProps) => {
  const { dispatch, state, onNodeSelect } = props
  const [blueprintDatasources, setBlueprintDatasources] = useState<
    Datasource[]
  >([])

  // fetch blueprints
  useEffect(() => {
    const url = api.dataSourcesGet(DataSourceType.Blueprints)
    axios
      .get(url)
      .then((res: any) => {
        const data: Datasource[] = res.data || []
        setBlueprintDatasources(data)
      })
      .catch((err: any) => {
        console.log(err)
      })
  }, [])
  return (
    <div>
      <BlueprintPickerTree
        datasources={blueprintDatasources}
        dispatch={dispatch}
        state={state}
        onNodeSelect={onNodeSelect}
      />
    </div>
  )
}
