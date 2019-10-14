import React, { useEffect, useState } from 'react'
import { Datasource, DataSourceType, DmtApi } from '../../api/Api'
import axios from 'axios'
import { DocumentsState } from '../common/DocumentReducer'
import BlueprintPickerTree from './BlueprintPickerTree'
import { AddNode } from '../common/tree-view/DocumentTree'
import { SetShowModal } from '../common/context-menu-actions/WithContextMenu'
import { H3 } from '../../components/Headers'
import { TreeNodeData } from '../../components/tree-view/types'

const api = new DmtApi()

type BlueprintPickerContentProps = {
  state: DocumentsState
  addNode: AddNode
  setShowModal: SetShowModal
  //the source treeNodeData that opened this picker.
  //@todo Document FinderWidget should pass its own document tree. Which dont use the SelectBlueprintNode
  sourceNode: TreeNodeData | undefined //undefined since DocumentFinderWidget uses this component.
}

export const BlueprintPickerContent = (props: BlueprintPickerContentProps) => {
  const { addNode, state, sourceNode, setShowModal } = props
  const [name, setName] = useState('')
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
      <div style={{ marginBottom: 20 }}>
        <label>Filename:</label>
        <input value={name} onChange={e => setName(e.target.value)} />
      </div>
      {name && (
        <>
          <BlueprintPickerTree
            datasources={blueprintDatasources}
            state={state}
            newFileName={name}
            sourceNode={sourceNode}
            addNode={addNode}
            setShowModal={setShowModal}
          />
        </>
      )}
    </div>
  )
}
