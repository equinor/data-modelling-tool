import React from 'react'

import Form from 'react-jsonschema-form'

const schema = {
  $schema: 'http://json-schema.org/draft-04/schema',
  title: 'Package',
  description: 'Template for SIMOS-type Packages',
  properties: {
    name: {
      description: 'The name of the Package',
      type: 'string',
    },
  },
  required: ['name'],
}

const log = type => console.log.bind(console, type)

const PackageForm = () => {
  return (
    <Form
      schema={schema}
      onChange={log('changed')}
      onSubmit={log('submitted')}
      onError={log('errors')}
    />
  )
}

export default PackageForm
