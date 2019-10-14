import React, { useEffect, useState } from 'react'
import Form from 'react-jsonschema-form'
import AttributeWidget from './widgets/Attribute'
import { DocumentData } from '../pages/blueprints/blueprint/types'

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

  console.log(documentData)

  return (
    <Form
      formData={
        documentData.hasOwnProperty('document')
          ? documentData.document.formData || {}
          : {}
      }
      schema={documentData.template.schema}
      uiSchema={documentData.template.uiSchema}
      fields={{ attribute: AttributeWidget }}
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
