import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Form from 'react-jsonschema-form'
import Header from '../../../components/Header'
//@ts-ignore
import toJsonSchema from 'to-json-schema'
import { BlueprintTreeViewActions } from '../tree-view/BlueprintTreeViewReducer'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import BlueprintPreview from '../preview/BlueprintPreview'

const log = (type: any) => console.log.bind(console, type)

interface Props {
  loading: boolean
  dispatch: (action: {}) => void
  selectedBlueprintId: string | null
  editMode: boolean | null
  setPreviewData: (data: any) => void
  formData: any
  onSubmit: any
}

const useBlueprintSchema = () => {
  const [template, setTemplate] = useState({})
  const [loading, setLoading] = useState(false)
  const error = false

  const templateUrl = '/api/templates/blueprint.json'
  useEffect(() => {
    async function fetchSchema() {
      const response = await axios(templateUrl)
      setTemplate(response.data)
      setLoading(false)
    }

    fetchSchema()
    setLoading(true)
  }, [templateUrl])

  return { loading, template, error }
}

const useBlueprintData = (selectedBlueprintId: string) => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const error = false

  const dataUrl = '/api/blueprints/' + selectedBlueprintId
  useEffect(() => {
    async function fetchSchema() {
      const response = await axios(dataUrl)
      setFormData(response.data)
      setLoading(false)
    }

    fetchSchema()
    setLoading(true)
  }, [dataUrl])

  return { loading, formData, error }
}

export const EditBlueprintForm = (props: Props) => {
  const { dispatch, selectedBlueprintId } = props

  const { loading, formData } = useBlueprintData(selectedBlueprintId)

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

      const url = `api/blueprints/${selectedBlueprintId}`

      axios
        .put(url, schemas.formData)
        .then(function(response) {
          dispatch(BlueprintTreeViewActions.addFile(response.data, title))
        })
        .catch(e => {
          console.error(e)
        })
    } catch (e) {
      //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
      alert('not valid jsonschema')
    }
  }

  return (
    <>
      <h3>Edit Blueprint</h3>
      <BlueprintForm
        loading={loading}
        formData={formData}
        onSubmit={onSubmit}
      />
    </>
  )
}

export const CreateBlueprintForm = (props: Props) => {
  const { dispatch, selectedBlueprintId } = props

  const onSubmit = (schemas: any) => {
    const title = schemas.formData.title

    try {
      //validate jsonSchema.
      toJsonSchema(schemas.formData)
      if (!title) {
        alert('jsonschema has no title.')
        return
      }

      let url = `api/blueprints/${selectedBlueprintId.replace(
        'package',
        title
      )}`

      axios
        .put(url, schemas.formData)
        .then(function(response) {
          dispatch(BlueprintTreeViewActions.addFile(response.data, title))
        })
        .catch(e => {
          console.error(e)
        })
    } catch (e) {
      //todo fix validation. Set required on fields. And strip optional fields with null values from formdata.
      alert('not valid jsonschema')
    }
  }

  return (
    <>
      <h3>Create blueprint</h3>
      <BlueprintForm formData={{}} onSubmit={onSubmit} />
    </>
  )
}

const BlueprintForm = (props: Props) => {
  const { loading = false, onSubmit, formData } = props

  const { loading: isLoadingSchema, template } = useBlueprintSchema()

  const [data, setData] = useState(formData)

  if (loading || isLoadingSchema) {
    return <div>Loading...</div>
  }

  return (
    <Grid fluid>
      <Row>
        <Col xs={12} md={6} lg={6}>
          <Form
            formData={data}
            schema={'schema' in template ? template['schema'] : template}
            uiSchema={'uiSchema' in template ? template['uiSchema'] : {}}
            onSubmit={onSubmit}
            onChange={schemas => {
              setData(schemas.formData)
            }}
            onError={log('errors')}
          />
        </Col>
        <Col xs={12} md={6} lg={6}>
          <BlueprintPreview data={data} />
        </Col>
      </Row>
    </Grid>
  )
}
