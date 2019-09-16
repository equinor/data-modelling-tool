import React, { useEffect, useState } from 'react'
import Form from 'react-jsonschema-form'
import { DocumentData } from '../pages/blueprints/blueprint/FetchDocument'

export interface FormProps {
  fetchDocument?: any
  onSubmit: (formData: any) => void
}

const log = (type: any) => console.log.bind(console, type)
export default ({ onSubmit, fetchDocument }: FormProps) => {
  const [loading, setLoading] = useState<boolean | null>(null)
  const [documentData, setDocumentData] = useState<DocumentData>({
    formData: {},
    uiSchema: {},
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
      formData={documentData.formData || {}}
      schema={documentData.template}
      uiSchema={documentData.uiSchema}
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
