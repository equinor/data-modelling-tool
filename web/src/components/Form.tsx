import React, { useEffect, useState } from 'react'
import Form from 'react-jsonschema-form'
import { DocumentData } from '../pages/blueprints/blueprint/FetchDocument'
import AttributeWidget from './widgets/Attribute'
import DocumentFinderWidget from './widgets/DocumentFinderWidget'

export interface FormProps {
  fetchDocument?: any
  onSubmit: (formData: any) => void
}

const log = (type: any) => console.log.bind(console, type)
export default ({ onSubmit, fetchDocument }: FormProps) => {
  const [loading, setLoading] = useState<boolean | null>(null)
  const [documentData, setDocumentData] = useState<DocumentData>({
    document: {},
    template: {},
  })

  useEffect(() => {
    if (fetchDocument) {
      setLoading(true)
      fetchDocument({
        onSuccess: (documentData: DocumentData) => {
          setDocumentData(documentData)
          setLoading(false)
        },
        onError: (err: any) => setLoading(false),
      })
    }
  }, [fetchDocument])

  //avoid first render.
  if (loading === null) {
    return null
  }
  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Form
      formData={
        documentData.hasOwnProperty('document')
          ? documentData.document.formData || {}
          : {}
      }
      schema={documentData.template.schema}
      // TODO: A proper select-uiSchema-system
      uiSchema={documentData.template.uiSchema[0]}
      fields={{ type: DocumentFinderWidget, attribute: AttributeWidget }}
      onSubmit={schemas => {
        const formData: any = schemas.formData
        try {
          onSubmit(formData)
        } catch (e) {
          //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
          console.error(e)
        }
      }}
      onChange={log('change')}
      onError={log('errors')}
    />
  )
}
