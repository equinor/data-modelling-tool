import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Form from 'react-jsonschema-form'

interface FormProps {
  schemaUrl: string
  dataUrl: string
  onSubmit: (formData: any) => any
}

const log = (type: any) => console.log.bind(console, type)
export default (props: FormProps) => {
  const { dataUrl, schemaUrl, onSubmit } = props
  const [data, setData] = useState({})
  const [schema, setSchema] = useState({})

  useEffect(() => {
    async function fetchSchema() {
      const response = await axios(schemaUrl)
      setSchema(response.data)
    }
    async function fetchData() {
      const response = await axios(dataUrl)
      setData(response.data)
    }
    fetchSchema()

    if (dataUrl) {
      fetchData()
    }
  }, [schemaUrl, dataUrl])

  return (
    <Form
      formData={data}
      schema={'schema' in schema ? schema['schema'] : schema}
      uiSchema={'uiSchema' in schema ? schema['uiSchema'] : {}}
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
