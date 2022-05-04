import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Form } from '../Form'
import { mockBlueprintGet } from '../test-utils'
import userEvent from '@testing-library/user-event'

describe('NumberField', () => {
  describe('TextWidget', () => {
    it('should render a single number field', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'number',
            },
          ],
        },
      ])
      const { container } = render(<Form type="SingleField" />)
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=number]`).length).toBe(1)
        expect(screen.getByText('foo')).toBeDefined()
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
              attributeType: 'number',
              default: 2,
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
        expect(value).toBe('2')
        fireEvent.submit(screen.getByRole('button'))
        expect(onSubmit).toHaveBeenCalled()
        expect(onSubmit).toHaveBeenCalledWith({
          foo: 2,
        })
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
              attributeType: 'number',
              default: 0,
            },
          ],
        },
      ])
      const formData = {
        foo: 2,
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
        expect(value).toBe('2')
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
              attributeType: 'number',
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
        if (inputNode) {
          userEvent.type(inputNode, '2')
          const value =
            inputNode !== null ? inputNode.getAttribute('value') : ''
          expect(value).toBe('2')
        }
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
              attributeType: 'number',
              optional: true,
            },
          ],
        },
      ])
      const onSubmit = jest.fn()
      render(<Form type="SingleField" onSubmit={onSubmit} />)
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
              attributeType: 'number',
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
  })
})
