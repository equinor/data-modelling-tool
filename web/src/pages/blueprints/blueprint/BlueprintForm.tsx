import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import BlueprintPreview from '../preview/BlueprintPreview'
import Tabs, { Tab, TabPanel, TabList } from '../../../components/Tabs'
import AttributeWidget from '../../../components/widgets/Attribute'
import { DocumentData } from './FetchDocument'

interface Props {
  data: DocumentData
  onSubmit: (data: any) => void
}

export default (props: Props) => {
  const {
    onSubmit,
    data: { formData, template, uiSchema },
  } = props
  const [data, setData] = useState({ ...formData })
  return (
    <Tabs>
      <TabList>
        <Tab>Form</Tab>
        <Tab>Schema</Tab>
      </TabList>
      <TabPanel>
        <Form
          formData={data || {}}
          schema={template || {}}
          uiSchema={uiSchema || {}}
          fields={{ attribute: AttributeWidget }}
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
