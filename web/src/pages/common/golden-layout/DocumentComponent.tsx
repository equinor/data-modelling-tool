import ViewBlueprintForm from '../../blueprints/blueprint/ViewBlueprintForm'
import React, { useReducer } from 'react'
import BlueprintReducer, { PageMode } from '../DocumentReducer'
import EditBlueprintForm from '../../blueprints/blueprint/EditBlueprintForm'
import styled from 'styled-components'
import FetchDocument, {
  DocumentData,
} from '../../blueprints/blueprint/FetchDocument'

const Wrapper = styled.div`
  padding: 20px;
`

const DocumentComponent = (props: any) => {
  console.log(props)

  const { dataUrl, schemaUrl } = props

  const [state, dispatch] = useReducer(BlueprintReducer, {
    dataUrl,
    schemaUrl,
    pageMode: PageMode.view,
  })

  const pageMode = state.pageMode

  return (
    <Wrapper>
      <FetchDocument
        pageMode={pageMode}
        dataUrl={dataUrl}
        schemaUrl={schemaUrl}
        render={(data: DocumentData) => {
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
                  dataUrl={dataUrl}
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

export default DocumentComponent
