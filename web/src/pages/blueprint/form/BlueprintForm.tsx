import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import BlueprintPreview from '../preview/BlueprintPreview'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import useFetch from '../../../components/useFetch'
import Tabs, { Tab, TabPanel, TabList } from '../../../components/Tabs'

interface Props {
  formData: any
  onSubmit: (data: any) => void
}

export default (props: Props) => {
  const { onSubmit, formData } = props

  const [loading, template, error] = useFetch('/api/templates/blueprint.json')
  if (error) {
    NotificationManager.error(``, 'Failed to fetch blueprint template')
  }

  const [data, setData] = useState(formData)

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Tabs>
      <TabList>
        <Tab>Form</Tab>
        <Tab>Schema</Tab>
      </TabList>
      <TabPanel>
        <Form
          formData={data}
          schema={'schema' in template ? template['schema'] : template}
          uiSchema={'uiSchema' in template ? template['uiSchema'] : {}}
          onSubmit={onSubmit}
          onChange={schemas => {
            setData(schemas.formData)
          }}
        />
      </TabPanel>
      <TabPanel>
        <BlueprintPreview data={data} />
      </TabPanel>
    </Tabs>
  )
}
