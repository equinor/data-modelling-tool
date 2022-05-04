import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Form } from '../Form'
import { mockBlueprintGet } from '../test-utils'
import userEvent from '@testing-library/user-event'

describe('StringField', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('TextWidget', () => {
    it('should render a single string field', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
          ],
        },
      ])
      const { container } = render(<Form type="SingleField" />)
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=text]`).length).toBe(1)
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
              attributeType: 'string',
              label: 'Foo',
            },
          ],
        },
      ])
      const { container } = render(<Form type="SingleFieldWithLabel" />)
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=text]`).length).toBe(1)
        expect(screen.getByText('Foo')).toBeDefined()
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
              attributeType: 'string',
              default: 'boo',
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
        expect(value).toBe('boo')
        fireEvent.submit(screen.getByRole('button'))
        expect(onSubmit).toHaveBeenCalled()
        expect(onSubmit).toHaveBeenCalledWith({
          foo: 'boo',
        })
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
              attributeType: 'string',
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

    it('should handle a default event', async () => {
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

    it('should handle a change event', async () => {
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
      render(<Form type="SingleField" />)

      await waitFor(() => {
        userEvent.type(screen.getByRole('textbox'), 'foobar')
        expect(screen.getByRole('textbox').getAttribute('value')).toBe(
          'boofoobar'
        )
      })
    })

    it('should handle an empty string change event', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
              default: 'bare',
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
        fireEvent.change(screen.getByRole('textbox'), { target: { value: '' } })
        expect(screen.getByRole('textbox').getAttribute('value')).toBe('')
      })
    })

    it('should default submit value to empty object', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
          ],
        },
      ])
      const onSubmit = jest.fn()
      const formData = {}
      const { container } = render(
        <Form type="SingleField" formData={formData} onSubmit={onSubmit} />
      )
      await waitFor(() => {
        fireEvent.submit(screen.getByRole('button'))
        expect(onSubmit).toHaveBeenCalled()
        expect(onSubmit).toHaveBeenCalledWith({})
      })
    })

    it('should handle optional', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
              optional: true,
            },
          ],
        },
      ])
      const onSubmit = jest.fn()
      const formData = {}
      const { container } = render(
        <Form type="SingleField" formData={formData} onSubmit={onSubmit} />
      )
      await waitFor(() => {
        fireEvent.submit(screen.getByRole('button'))
        expect(onSubmit).toHaveBeenCalled()
        expect(onSubmit).toHaveBeenCalledWith({})
        expect(screen.getByText('foo (optional)')).toBeDefined()
      })
    })

    it('should not call onSubmit if non-optional field are missing value', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
              optional: false,
            },
          ],
        },
      ])
      const onSubmit = jest.fn()
      render(<Form type="SingleField" onSubmit={onSubmit} />)
      fireEvent.submit(screen.getByRole('button'))
      await waitFor(() => {
        expect(onSubmit).not.toHaveBeenCalled()
        expect(onSubmit).toHaveBeenCalledTimes(0)
      })
    })

    it.skip('should render a string field with a description', () => {})

    it.skip('should handle a blur event', () => {})

    it.skip('should handle a focus event', () => {})
  })
})
