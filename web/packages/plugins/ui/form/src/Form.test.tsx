import { render, screen, waitFor } from '@testing-library/react'
import React, { useEffect, useState } from 'react'
import { Form } from './Form'
import { mockGetBlueprint } from './test-utils'

describe('Form', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('Empty Type', () => {
    it('should render a submit button', () => {
      render(<Form />)
      expect(screen.getAllByRole('button').length).toBe(1)
    })
  })

  describe('With Type', () => {
    it('should render attributes', async () => {
      const mock = mockGetBlueprint([
        {
          type: 'system/SIMOS/Blueprint',
          name: 'Root',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
            {
              name: 'bar',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
          ],
        },
      ])

      const { container } = render(<Form type="Root" />)
      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBe(1)
        expect(container.querySelector(`input[name="foo"]`)).toBeTruthy()
        expect(container.querySelector(`input[name="bar"]`)).toBeTruthy()
        expect(container.querySelector(`input[name="baz"]`)).toBeNull()
        // Should only call get blueprint once
        expect(mock).toHaveBeenCalledWith({ typeRef: 'Root' })
        expect(mock).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('Nested', () => {
    it('should render nested attributes', async () => {
      const mock = mockGetBlueprint([
        {
          type: 'system/SIMOS/Blueprint',
          name: 'Root',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
            {
              name: 'child',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'Child',
            },
          ],
        },
        {
          type: 'system/SIMOS/Blueprint',
          name: 'Child',
          attributes: [
            {
              name: 'bar',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'string',
            },
          ],
        },
      ])

      const { container } = render(<Form type="Root" />)
      await waitFor(() => {
        expect(screen.getAllByRole('button').length).toBe(1)
        expect(container.querySelector(`input[name="foo"]`)).toBeTruthy()
        expect(container.querySelector(`input[name="child.bar"]`)).toBeTruthy()
        expect(container.querySelector(`input[name="baz"]`)).toBeNull()
        // Should only call get blueprint once
        expect(mock).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe.skip('Submit handler', () => {})
  describe.skip('Error handler', () => {})
})
