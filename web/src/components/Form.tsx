import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Form from 'react-jsonschema-form'

interface FormProps extends Node {
  schemaUrl: string
  onSubmit: (formData: any) => {}
}

const log = (type: any) => console.log.bind(console, type)
export default (props: FormProps) => {
  const { schemaUrl } = props
  const [schema, setSchema] = useState({})

  useEffect(() => {
    async function fetchSchema() {
      const response = await axios(schemaUrl)
      setSchema(response.data)
    }
    fetchSchema()
  }, [schemaUrl])

  return (
    <Form
      formData={{}}
      schema={'schema' in schema ? schema['schema'] : schema}
      uiSchema={'uiSchema' in schema ? schema['uiSchema'] : {}}
      onSubmit={schemas => {
        const formData: any = schemas.formData
        try {
          props.onSubmit(formData)
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
