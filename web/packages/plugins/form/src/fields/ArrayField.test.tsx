import { mockBlueprintGet } from '../test-utils'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from '../Form'
import React from 'react'

describe('ArrayField', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Unsupported array', () => {
    it('should warn on wrong attribute type', async () => {
      mockBlueprintGet([
        {
          name: 'MyBlueprint',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'invalid',
              dimensions: '*',
            },
          ],
        },
      ])
      const formData = {
        foo: [
          {
            type: 'invalid',
          },
        ],
      }
      render(<Form type="MyBlueprint" formData={formData} />)
      await waitFor(() => {
        expect(screen.getByText('Could not find the blueprint')).toBeDefined()
      })
    })
  })

  describe('List of strings', () => {
    const blueprint = {
      name: 'MyBlueprint',
      type: 'system/SIMOS/Blueprint',
      attributes: [
        {
          name: 'array',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'string',
          dimensions: '*',
        },
      ],
    }

    it('should contain no field in the list by default', async () => {
      mockBlueprintGet([blueprint])
      const { container } = render(<Form type="MyBlueprint" />)
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=text]`).length).toBe(0)
      })
    })

    it('should have an add button', async () => {
      mockBlueprintGet([blueprint])
      const { container } = render(<Form type="MyBlueprint" />)
      await waitFor(() => {
        expect(screen.getByText('Add')).toBeDefined()
      })
    })

    it('should add a new field when clicking the add button', async () => {
      mockBlueprintGet([blueprint])
      const { container } = render(<Form type="MyBlueprint" />)
      await waitFor(() => {
        fireEvent.click(screen.getByText('Add'))
        expect(container.querySelectorAll(` input[type=text]`).length).toBe(1)
      })
    })

    it('should fill an array field with data', async () => {
      mockBlueprintGet([blueprint])
      const formData = {
        array: ['foo', 'bar'],
      }
      const { container } = render(
        <Form type="MyBlueprint" formData={formData} />
      )
      await waitFor(() => {
        const inputs = container.querySelectorAll(` input[type=text]`)
        expect(inputs.length).toBe(2)
        expect(inputs[0].getAttribute('value')).toBe('foo')
        expect(inputs[1].getAttribute('value')).toBe('bar')
      })
    })

    it('should render the input widgets with the expected ids', async () => {
      mockBlueprintGet([blueprint])
      const formData = {
        array: ['foo', 'bar'],
      }
      const { container } = render(
        <Form type="MyBlueprint" formData={formData} />
      )
      await waitFor(() => {
        const inputs = container.querySelectorAll(` input[type=text]`)
        expect(inputs.length).toBe(2)
        expect(inputs[0].id).toBe('array.0')
        expect(inputs[1].id).toBe('array.1')
      })
    })

    it('should render nested type with the expected ids', async () => {
      const parentBlueprint = {
        name: 'MyBlueprint',
        type: 'system/SIMOS/Blueprint',
        attributes: [
          {
            name: 'array',
            type: 'system/SIMOS/BlueprintAttribute',
            attributeType: 'Item',
            dimensions: '*',
          },
        ],
      }
      const nestedBlueprint = {
        name: 'Item',
        type: 'system/SIMOS/Blueprint',
        attributes: [
          {
            name: 'foo',
            type: 'system/SIMOS/BlueprintAttribute',
            attributeType: 'string',
          },
        ],
      }

      mockBlueprintGet([parentBlueprint, nestedBlueprint])
      const formData = {
        array: [
          {
            foo: 'foo',
          },
        ],
      }
      const { container } = render(
        <Form type="MyBlueprint" formData={formData} />
      )
      await waitFor(() => {
        const inputs = container.querySelectorAll(` input[type=text]`)
        expect(inputs.length).toBe(1)
        expect(inputs[0].id).toBe('array.0.foo')
      })
    })
  })

  describe('Nested lists', () => {
    const outer = {
      name: 'Root',
      type: 'system/SIMOS/Blueprint',
      attributes: [
        {
          name: 'array',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'Item',
          dimensions: '*',
        },
      ],
    }
    const inner = {
      name: 'Item',
      type: 'system/SIMOS/Blueprint',
      attributes: [
        {
          name: 'foo',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'string',
          dimensions: '*',
        },
      ],
    }

    it('should render two lists of inputs inside of a list', async () => {
      mockBlueprintGet([outer, inner])
      const formData = {
        array: [
          {
            foo: ['1', '2', '3'],
          },
        ],
      }
      const { container } = render(<Form type="Root" formData={formData} />)
      await waitFor(() => {
        const inputs = container.querySelectorAll(` input[type=text]`)
        expect(inputs.length).toBe(3)
        expect(inputs[0].id).toBe('array.0.foo.0')
        expect(inputs[1].id).toBe('array.0.foo.1')
        expect(inputs[2].id).toBe('array.0.foo.2')
      })
    })

    it.skip('should add an inner when clicking the add button', async () => {
      mockBlueprintGet([outer, inner])
      const { container } = render(<Form type="Root" />)
      await waitFor(() => {
        fireEvent.click(screen.getByTestId('add-array'))
        expect(container.querySelectorAll(` input[type=text]`).length).toBe(1)
      })
    })
  })
})
