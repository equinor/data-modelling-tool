import ViewBlueprintForm from './ViewBlueprintForm'
import React, { useReducer } from 'react'
import BlueprintReducer, { PageMode } from '../../common/DocumentReducer'
import EditBlueprintForm from './EditBlueprintForm'
import styled from 'styled-components'
import FetchDocument, { DocumentData } from './FetchDocument'

const Wrapper = styled.div`
  padding: 20px;
`

const Blueprint = (props: any) => {
  const { selectedDocumentId, currentDatasourceId } = props

  const [state, dispatch] = useReducer(BlueprintReducer, {
    selectedDocumentId,
    currentDatasourceId,
    pageMode: PageMode.view,
  })

  const pageMode = state.pageMode

  return (
    <Wrapper>
      <FetchDocument
        pageMode={pageMode}
        documentId={state.selectedDocumentId}
        render={(data: DocumentData) => {
          if (!state.selectedDocumentId) {
            return null
          }
          switch (pageMode) {
            case PageMode.view:
              return (
                <ViewBlueprintForm
                  documentData={data}
                  state={state}
                  dispatch={dispatch}
                />
              )
            case PageMode.edit:
              return (
                <EditBlueprintForm
                  documentData={data}
                  state={state}
                  dispatch={dispatch}
                />
              )
            default:
              return null
          }
        }}
      />
    </Wrapper>
  )
}

export default Blueprint
