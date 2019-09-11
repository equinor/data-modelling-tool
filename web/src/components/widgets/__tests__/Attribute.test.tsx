import React from 'react'
// @ts-ignore
import TestRenderer from 'react-test-renderer'
import Attribute from '../Attribute'

describe('AttributeComponent', () => {
  it('renders without crashing', () => {
    const props = {
      formData: {
        type: 'string',
        name: 'TestName',
        value: 'TestValue',
        dimensions: '[*,2]',
      },
      onChange: () => {},
    }

    TestRenderer.create(<Attribute {...props} />)
  })
})
