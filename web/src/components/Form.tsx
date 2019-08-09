import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Form from 'react-jsonschema-form'
//@ts-ignore
import toJsonSchema from 'to-json-schema'

type Node = {
  isRoot: boolean
  path: string
  endpoint: string
  type: string
}

interface FormProps extends Node {
  schemaUrl: 'string'
  dataUrl: 'string'
  submitUrl: 'string'
  onSubmit: (name: string) => {}
}

const log = (type: any) => console.log.bind(console, type)
export default (props: FormProps) => {
  const { schemaUrl, onSubmit } = props
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
        const url = generateUrl(props, formData.name)
        try {
          //validate jsonSchema.d
          toJsonSchema(formData)

          axios({
            method: 'put',
            url,
            data: formData,
            responseType: 'json',
          })
            .then(function(response) {
              onSubmit(response.data)
            })
            .catch(e => {
              console.error(e)
              // @todo use react-alert from npm.
              alert('failed to save root package.')
            })
        } catch (e) {
          //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
          alert('not valid jsonschema')
        }
      }}
      onChange={log('change')}
      onError={log('errors')}
    />
  )
}

function generateUrl(node: Node, name: string) {
  if (node.type === 'folder') {
    //generate package url
    return `${node.endpoint}${node.path}/${name}`
  } else {
    // genereate file url
    return `${node.endpoint}/${node.path}/${name}/${name}.json`
  }
}
