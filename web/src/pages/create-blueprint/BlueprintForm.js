import React from 'react'
import Form from 'react-jsonschema-form'
import { HeaderItem, HeaderWrapper } from './BlueprintPreview'

const schema = {
  title: 'Todo',
  type: 'object',
  required: ['title'],
  properties: {
    title: { type: 'string', title: 'Title', default: 'A new task' },
    done: { type: 'boolean', title: 'Done?', default: false },
  },
}

const log = type => console.log.bind(console, type)

export default props => {
  const { selectedTemplate } = props
  return (
    <div>
      <Header selectedTemplate={selectedTemplate} />
      <div style={{ marginTop: 20 }}>
        <BluePrintTemplateForm selectedTemplate={selectedTemplate} />
      </div>
    </div>
  )
}

const Header = props => {
  const { selectedTemplate } = props
  return (
    <HeaderWrapper>
      <HeaderItem>
        <h3>Edit model</h3>
      </HeaderItem>
      <HeaderItem>
        <div style={{ paddingRight: 10 }}>
          {selectedTemplate && selectedTemplate.path}
        </div>
      </HeaderItem>
    </HeaderWrapper>
  )
}

const BluePrintTemplateForm = props => {
  const { selectedTemplate } = props
  if (!selectedTemplate) {
    return null
  }
  console.log(selectedTemplate)
  return (
    <Form
      schema={schema}
      onChange={log('changed')}
      onSubmit={log('submitted')}
      onError={log('errors')}
    />
  )
}
