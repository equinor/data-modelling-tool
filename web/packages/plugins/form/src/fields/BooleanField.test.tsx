import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Form } from '../Form'
import { mockBlueprintGet } from '../test-utils'
import userEvent from '@testing-library/user-event'
import { act } from 'react-dom/test-utils'

describe('BooleanField', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('TextWidget', () => {
    it('should render a single boolean field', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'boolean',
            },
          ],
        },
      ])
      const { container } = render(<Form type="SingleField" />)
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=checkbox]`).length).toBe(
          1
        )
        expect(screen.getByText('foo')).toBeDefined()
      })
    })

    it('should render a string field with a label', async () => {
      mockBlueprintGet([
        {
          name: 'SingleFieldWithLabel',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'boolean',
              label: 'Foo',
            },
          ],
        },
      ])
      const { container } = render(<Form type="SingleFieldWithLabel" />)
      await waitFor(() => {
        expect(screen.getByText('Foo')).toBeDefined()
      })
    })

    it('should render the widget with the expected id', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'boolean',
              default: 'boo',
            },
          ],
        },
      ])
      const { container } = render(<Form type="SingleField" />)
      await waitFor(() => {
        const inputNode: Element | null = container.querySelector(
          ` input[name="foo"]`
        )
        expect(inputNode).toBeDefined()
        const id = inputNode !== null ? inputNode.getAttribute('id') : ''
        expect(id).toBe('foo')
      })
    })

    it('should fill field with data', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
              default: 'boo',
            },
          ],
        },
      ])
      const formData = {
        foo: 'beep',
      }
      const { container } = render(
        <Form type="SingleField" formData={formData} />
      )
      await waitFor(() => {
        const inputNode: Element | null = container.querySelector(
          ` input[name="foo"]`
        )
        expect(inputNode).toBeDefined()
        const value = inputNode !== null ? inputNode.getAttribute('value') : ''
        expect(value).toBe(formData.foo)
      })
    })

    it('should assign a default value', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'boolean',
              default: 'True',
            },
          ],
        },
      ])
      const onSubmit = jest.fn()
      const { container } = render(
        <Form type="SingleField" onSubmit={onSubmit} />
      )
      await waitFor(() => {
        const inputNode: Element | null = container.querySelector(
          ` input[name="foo"]`
        )
        expect(inputNode).toBeDefined()
        const value = inputNode !== null ? inputNode.getAttribute('value') : ''
        expect(value).toBe('true')
        fireEvent.submit(screen.getByRole('button'))
        expect(onSubmit).toHaveBeenCalled()
        expect(onSubmit).toHaveBeenCalledWith({
          foo: true,
        })
      })
    })

    it('should handle a change event', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'boolean',
              default: 'True',
            },
          ],
        },
      ])
      const { container } = render(<Form type="SingleField" />)
      await waitFor(() => {
        const inputNode: Element | null = container.querySelector(
          ` input[name="foo"]`
        )
        expect(inputNode).toBeDefined()
        const value = inputNode !== null ? inputNode.getAttribute('value') : ''
        expect(value).toBe('true')
        userEvent.click(screen.getByRole('checkbox'))
        fireEvent.submit(screen.getByRole('button'))
      })
    })

    it.skip('should render a description', () => {})

    it.skip('formData should default to undefined', () => {})
  })
})
