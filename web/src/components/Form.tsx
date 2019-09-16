import React from 'react'
import Form from 'react-jsonschema-form'
import useFetch from './useFetch'

export interface FormProps {
  schemaUrl: string
  dataUrl: string | null
  fetchDocumentData?: any
  onSubmit: (formData: any) => void
}

const log = (type: any) => console.log.bind(console, type)
export default (props: FormProps) => {
  const { schemaUrl, dataUrl, onSubmit } = props

  const [schemaLoading, schemaData] = useFetch(schemaUrl)
  const [dataLoading, dataData] = useFetch(dataUrl)

  if (schemaLoading || dataLoading) {
    return <div>Loading...</div>
  }

  return (
    <Form
      formData={dataData}
      schema={'schema' in schemaData ? schemaData['schema'] : schemaData}
      uiSchema={'uiSchema' in schemaData ? schemaData['uiSchema'] : {}}
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
