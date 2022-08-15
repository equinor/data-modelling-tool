import { mockBlueprintGet } from '../test-utils'
import { render, screen, waitFor } from '@testing-library/react'
import { Form } from '../Form'
import React from 'react'

describe('AttributeField', () => {
  describe('Unsupported field', () => {
    it('should warn on invalid type (missing blueprint(', async () => {
      mockBlueprintGet([
        {
          name: 'SingleField',
          type: 'system/SIMOS/Blueprint',
          attributes: [
            {
              name: 'foo',
              type: 'system/SIMOS/BlueprintAttribute',
              attributeType: 'invalid',
            },
          ],
        },
      ])
      render(<Form type="SingleField" />)
      await waitFor(() => {
        expect(
          screen.getByText('Could not find the blueprint', { exact: false })
        ).toBeDefined()
      })
    })
  })
})
