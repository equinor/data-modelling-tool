import ViewBlueprintForm from './ViewBlueprintForm'
import React, { useReducer } from 'react'
import BlueprintReducer, { PageMode } from '../../common/DocumentReducer'
import EditBlueprintForm from './EditBlueprintForm'
import CreateBlueprintForm from './CreateBlueprintForm'
import styled from 'styled-components'

const Wrapper = styled.div`
  padding: 20px;
`

const Blueprint = (props: any) => {
  const { selectedDocumentId, currentDatasourceId } = props

  const [state, dispatch] = useReducer(BlueprintReducer, {
    selectedDocumentId: selectedDocumentId,
    currentDatasourceId: currentDatasourceId,
    pageMode: PageMode.view,
  })

  const pageMode = state.pageMode

  return (
    <Wrapper>
      {pageMode === PageMode.view && state.selectedDocumentId && (
        <ViewBlueprintForm state={state} dispatch={dispatch} />
      )}
      {pageMode === PageMode.edit && state.selectedDocumentId && (
        <EditBlueprintForm state={state} dispatch={dispatch} />
      )}

      {pageMode === PageMode.create && state.selectedDocumentId && (
        <CreateBlueprintForm dispatch={dispatch} state={state} />
      )}
    </Wrapper>
  )
}

export default Blueprint
