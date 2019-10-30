import React, { useEffect, useState } from 'react'
import Form from 'react-jsonschema-form'
import DocumentFinderWidget from './widgets/DocumentFinderWidget'
import { attributeWidget } from './widgets/Attribute'

export interface FormProps {
  fetchDocument?: any
  onSubmit: (formData: any) => void
  selectedUiSchema?: string
}

const log = (type: any) => console.log.bind(console, type)
export default ({
  onSubmit,
  fetchDocument,
  selectedUiSchema = 'DEFAULT',
}: FormProps) => {
  const [loading, setLoading] = useState<boolean | null>(null)
  const [documentData, setDocumentData] = useState({
    document: {},
    template: {},
  })

  useEffect(() => {
    if (fetchDocument) {
      setLoading(true)
      fetchDocument({
        onSuccess: (documentData: any) => {
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

  // @ts-ignore
  const schema = documentData.template.schema
  // @ts-ignore
  const uiSchema = documentData.template.uiSchema

  // @ts-ignore
  return (
    <Form
      formData={
        documentData.hasOwnProperty('document')
          ? // @ts-ignore
            documentData.document || {}
          : {}
      }
      // @ts-ignore
      schema={schema}
      // TODO: A proper select-uiSchema-system
      fields={{ type: DocumentFinderWidget, attribute: attributeWidget() }}
      uiSchema={uiSchema}
      onSubmit={schemas => {
        const formData: any = schemas.formData
        try {
          onSubmit(formData)
        } catch (e) {
          //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
          console.error(e)
        }
      }}
      onError={log('errors')}
    />
  )
}
