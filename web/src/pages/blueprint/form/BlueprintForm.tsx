import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import BlueprintPreview from '../preview/BlueprintPreview'
import Tabs, { Tab, TabPanel, TabList } from '../../../components/Tabs'
import { DmtApi } from '../../../api/Api'
import useFetch from '../../../components/useFetch'
const api = new DmtApi()

interface Props {
  formData: any
  onSubmit: (data: any) => void
}

export default (props: Props) => {
  const { onSubmit, formData } = props
  const [loading, template] = useFetch(api.templatesBlueprintGet())
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
