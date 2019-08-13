import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Form from 'react-jsonschema-form'
import Header from '../../../components/Header'
//@ts-ignore
import toJsonSchema from 'to-json-schema'
import { FilesActions } from '../tree-view/BluePrintTreeViewReducer'
const log = (type: any) => console.log.bind(console, type)

interface Props {
  state: any
  dispatch: (action: {}) => void
  selectedTemplateId: string | null
  editMode: boolean
  setPreviewData: (data: any) => void
}

export default (props: Props) => {
  const { selectedTemplateId, editMode } = props
  return (
    <React.Fragment>
      <Header>
        <h3>{editMode ? 'Edit' : 'Create'} blueprint</h3>
        <div style={{ paddingRight: 10 }}>{selectedTemplateId}</div>
      </Header>

      <div style={{ marginTop: 20, padding: 20 }}>
        {// check selectedTemplate to avoid having a conditional before a hook in BluePrintTemplateForm.
        selectedTemplateId && <BluePrintForm {...props} />}
      </div>
    </React.Fragment>
  )
}

const BluePrintForm = (props: Props) => {
  const { dispatch, selectedTemplateId, editMode, setPreviewData } = props
  const [template, setTemplate] = useState({})
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)

  const templateUrl = '/api/templates/blueprint.json'
  const dataUrl = '/api/blueprints/' + selectedTemplateId
  useEffect(() => {
    async function fetchSchema() {
      const response = await axios(templateUrl)
      setTemplate(response.data)
    }
    async function fetchData() {
      const response = await axios(dataUrl)
      setFormData(response.data)
      setPreviewData(response.data)
    }
    setLoading(true)
    fetchSchema()
    if (selectedTemplateId && editMode) {
      fetchData()
    } else {
      setFormData({})
    }
    setLoading(false)
  }, [templateUrl, dataUrl, selectedTemplateId, editMode, setPreviewData])

  if (loading) {
    return <div>Loading...</div>
  }

  const onSubmit = (schemas: any) => {
    const title = schemas.formData.title

    try {
      //validate jsonSchema.
      toJsonSchema(schemas.formData)
      if (!title) {
        alert('jsonschema has no title.')
        return
      }

      if (selectedTemplateId) {
        let url = `api/blueprints/${selectedTemplateId.replace(
          'package',
          title
        )}`
        if (editMode) {
          //editing, filename exists.
          url = `api/blueprints/${selectedTemplateId}`
        }

        axios
          .put(url, schemas.formData)
          .then(function(response) {
            dispatch(FilesActions.addFile(response.data, title))
          })
          .catch(e => {
            console.error(e)
          })
      }
    } catch (e) {
      //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
      alert('not valid jsonschema')
    }
  }
  return (
    <Form
      formData={formData || { properties: [] }}
      schema={'schema' in template ? template['schema'] : template}
      uiSchema={'uiSchema' in template ? template['uiSchema'] : {}}
      onSubmit={onSubmit}
      onChange={schemas => {
        setFormData(schemas.formData)
        setPreviewData(schemas.formData)
      }}
      onError={log('errors')}
    />
  )
}
