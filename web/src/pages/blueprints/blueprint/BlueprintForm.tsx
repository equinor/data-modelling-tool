import React, { useState } from 'react'
import Form from 'react-jsonschema-form'
import BlueprintPreview from '../preview/BlueprintPreview'
import Tabs, { Tab, TabPanel, TabList } from '../../../components/Tabs'
import AttributeWidget from '../../../components/widgets/Attribute'
import { DocumentData } from './FetchDocument'
import './form-styles.css'

interface Props {
  documentData: DocumentData
  onSubmit: (data: any) => void
}

function getUiSchema(uiRecipes: any[], name: string) {
  if (uiRecipes) {
    const uiRecipe = uiRecipes.find((uiSchema: any) => uiSchema.name === name)
    if (uiRecipe) {
      return uiRecipe.uiSchema
    }
  }
  return {}
}

export default ({ documentData, onSubmit }: Props) => {
  const { document, template } = documentData
  const { uiRecipes, storageRecipes, ...rest } = document
  const [data, setData] = useState({ ...rest })
  const uiSchema = getUiSchema(template.uiRecipes, 'edit')
  // console.log(JSON.stringify(data, null, 2))
  // @todo not needed since we are using a custom widget. keyword in json form.
  try {
    delete template.schema.properties.attributes.items.properties.type.enum
  } catch (e) {
    //nothing to worry about. too cumbersome to test each property.
  }
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
