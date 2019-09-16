import ViewBlueprintForm from './ViewBlueprintForm'
import React, { useReducer } from 'react'
import BlueprintReducer, { PageMode } from '../../common/DocumentReducer'
import EditBlueprintForm from './EditBlueprintForm'
import CreateBlueprintForm from './CreateBlueprintForm'
import styled from 'styled-components'
import FetchDocument, { DocumentData } from './FetchDocument'

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
      <FetchDocument
        state={{ selectedDocumentId }}
        render={(data: DocumentData) => {
          if (!selectedDocumentId) {
            return null
          }
          switch (pageMode) {
            case PageMode.view:
              return (
                <ViewBlueprintForm
                  data={data}
                  state={state}
                  dispatch={dispatch}
                />
              )
            case PageMode.create:
              return (
                <CreateBlueprintForm
                  data={data}
                  state={state}
                  dispatch={dispatch}
                />
              )
            case PageMode.edit:
              return (
                <EditBlueprintForm
                  data={data}
                  state={state}
                  dispatch={dispatch}
                />
              )
            default:
              return null
          }
        }}
      ></FetchDocument>
    </Wrapper>
  )
}

export default Blueprint
