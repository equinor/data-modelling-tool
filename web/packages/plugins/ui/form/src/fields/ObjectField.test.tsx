import React from 'react'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Form } from '../Form'
import { mockGetBlueprint } from '../test-utils'

describe('ObjectField', () => {
  describe('Blueprint', () => {
    const blueprint = {
      name: 'MyBlueprint',
      type: 'object',
      attributes: [
        {
          name: 'foo',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'string',
          default: 'beep',
        },
        {
          name: 'bar',
          type: 'system/SIMOS/BlueprintAttribute',
          attributeType: 'boolean',
        },
      ],
    }

    it.skip('should render a default attribute label', async () => {})

    it('should render a string attribute', async () => {
      mockGetBlueprint([blueprint])
      const { container } = render(<Form type="MyBlueprint" />)
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=text]`).length).toBe(1)
        expect(screen.getByText('foo')).toBeDefined()
      })
    })

    it('should render a boolean attribute', async () => {
      mockGetBlueprint([blueprint])
      const { container } = render(<Form type="MyBlueprint" />)
      await waitFor(() => {
        expect(container.querySelectorAll(` input[type=checkbox]`).length).toBe(
          1
        )
        expect(screen.getByText('bar')).toBeDefined()
      })
    })

    it('should handle a default object value', async () => {
      mockGetBlueprint([blueprint])
      const { container } = render(<Form type="MyBlueprint" />)

      await waitFor(() => {
        const foo: Element | null = container.querySelector(
          ` input[name="foo"]`
        )
        expect(foo).toBeDefined()
        const fooValue = foo !== null ? foo.getAttribute('value') : ''
        expect(fooValue).toBe('beep')

        const bar: Element | null = container.querySelector(
          ` input[type="checkbox"]`
        )
        expect(bar).toBeDefined()
        const barValue = bar !== null ? bar.getAttribute('value') : ''
        expect(barValue).toBe('false')
      })
    })

    it.skip('should handle required values', () => {})

    it('should handle object fields change events', async () => {
      mockGetBlueprint([blueprint])
      const onSubmit = jest.fn()
      const { container } = render(
        <Form type="MyBlueprint" onSubmit={onSubmit} />
      )
      await waitFor(() => {
        fireEvent.change(screen.getByRole('textbox'), {
          target: { value: 'changed' },
        })
        expect(screen.getByRole('textbox').getAttribute('value')).toBe(
          'changed'
        )
      })
    })

    it('should render the widget with the expected id', async () => {
      mockGetBlueprint([blueprint])
      const { container } = render(<Form type="MyBlueprint" />)
      await waitFor(() => {
        const inputNode: Element | null = container.querySelector(
          ` input[name="foo"]`
        )
        expect(inputNode).toBeDefined()
        const id = inputNode !== null ? inputNode.getAttribute('id') : ''
        expect(id).toBe('foo')
      })
    })
  })

  describe.skip('fields ordering', () => {})

  describe.skip('Title', () => {})
})
