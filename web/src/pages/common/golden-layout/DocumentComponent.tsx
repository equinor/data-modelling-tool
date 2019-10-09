import ViewBlueprintForm from '../../blueprints/blueprint/ViewBlueprintForm'
import React, { useReducer } from 'react'
import BlueprintReducer, { PageMode } from '../DocumentReducer'
import EditBlueprintForm from '../../blueprints/blueprint/EditBlueprintForm'
import styled from 'styled-components'
import FetchDocument, {
  DocumentData,
} from '../../blueprints/blueprint/FetchDocument'
// @ts-ignore
import objectPath from 'object-path'

const Wrapper = styled.div`
  padding: 20px;
`

const DocumentComponent = (props: any) => {
  const { dataUrl, schemaUrl, attribute = null } = props

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
          const formData = attribute
            ? objectPath.get(data.document, attribute)
            : data.document
          let documentData = {
            template: data.template,
            document: formData || {},
          }

          switch (pageMode) {
            case PageMode.view:
              return (
                <ViewBlueprintForm
                  documentData={documentData}
                  state={state}
                  dispatch={dispatch}
                />
              )
            case PageMode.edit:
              return (
                <EditBlueprintForm
                  documentData={documentData}
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
