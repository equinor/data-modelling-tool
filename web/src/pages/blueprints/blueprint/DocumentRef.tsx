import ViewBlueprintForm from './ViewBlueprintForm'
import React, { useEffect, useReducer, useState } from 'react'
import BlueprintReducer, { PageMode } from '../../common/DocumentReducer'
import EditBlueprintForm from './EditBlueprintForm'
import styled from 'styled-components'
import FetchDocument, { DocumentData } from './FetchDocument'
import Api2 from '../../../api/Api2'
// @ts-ignore
import objectPath from 'object-path'

const Wrapper = styled.div`
  padding: 20px;
`

const DocumentRef = (props: any) => {
  const { dataSourceId, selectedDocumentId, attribute, templateRef } = props

  console.log(props)

  const [state, dispatch] = useReducer(BlueprintReducer, {
    selectedDocumentId: `${dataSourceId}/${selectedDocumentId}`,
    currentDatasourceId: dataSourceId,
    pageMode: PageMode.view,
  })

  const [jsonSchema, setJsonSchema] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocument = Api2.fetchJsonSchema(templateRef)
    fetchDocument({
      onSuccess: (data: DocumentData) => {
        setJsonSchema(data.template)
        setLoading(false)
      },
      onError: (err: any) => setLoading(false),
    })
  }, [templateRef])

  const pageMode = state.pageMode

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Wrapper>
      <FetchDocument
        pageMode={pageMode}
        documentId={state.selectedDocumentId}
        render={(data: DocumentData) => {
          if (!state.selectedDocumentId) {
            return null
          }

          console.log('DATA', data, attribute)
          const formData = objectPath.get(data.document.formData, attribute)

          let documentRefData = {
            template: jsonSchema,
            document: {
              formData: formData || {},
            },
          }
          console.log(documentRefData)

          switch (pageMode) {
            case PageMode.view:
              return (
                <ViewBlueprintForm
                  documentData={documentRefData}
                  state={state}
                  dispatch={dispatch}
                />
              )
            case PageMode.edit:
              return (
                <EditBlueprintForm
                  documentData={documentRefData}
                  documentId={`${state.selectedDocumentId}/${attribute}`}
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

export default DocumentRef
