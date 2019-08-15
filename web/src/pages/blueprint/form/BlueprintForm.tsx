import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import { Col, Grid, Row } from 'react-styled-flexboxgrid'
import BlueprintPreview from '../preview/BlueprintPreview'
import useAxios from '@use-hooks/axios'
import { NotificationManager } from 'react-notifications'

const log = (type: any) => console.log.bind(console, type)

interface Props {
  formData: any
  onSubmit: (data: any) => void
}

const BlueprintForm = (props: Props) => {
  const { onSubmit, formData } = props

  const { response, loading } = useAxios({
    url: '/api/templates/blueprint.json',
    method: 'GET',
    trigger: true,
    customHandler: error => {
      if (error) {
        NotificationManager.error(``, 'Failed to fetch blueprint template')
      }
    },
  })

  const [data, setData] = useState(formData)

  if (loading) {
    return <div>Loading...</div>
  }

  const { data: template } = response || { data: {} }

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

export default BlueprintForm
