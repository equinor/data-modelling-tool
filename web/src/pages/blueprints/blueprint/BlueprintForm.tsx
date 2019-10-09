import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import BlueprintPreview from '../preview/BlueprintPreview'
import Tabs, { Tab, TabPanel, TabList } from '../../../components/Tabs'
import AttributeWidget from '../../../components/widgets/Attribute'
import { DocumentData } from './FetchDocument'

interface Props {
  documentData: DocumentData
  onSubmit: (data: any) => void
}

export default ({ documentData, onSubmit }: Props) => {
  const { document, template } = documentData
  const [data, setData] = useState({ ...document })
  return (
    <Tabs>
      <TabList>
        <Tab>Form</Tab>
        <Tab>Schema</Tab>
      </TabList>
      <TabPanel>
        <Form
          formData={data || {}}
          schema={template.schema || {}}
          uiSchema={template.uiSchema || {}}
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
