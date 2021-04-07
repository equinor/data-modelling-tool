import { act, renderHook } from '@testing-library/react-hooks'
import React from 'react'
import { useLayout } from './useLayout'

describe('the useLayout hook', () => {
  it('should return empty layout object by default', () => {
    const { result } = renderHook(() => useLayout())
    expect(result.current.models.layout).toStrictEqual({ myLayout: null })
  })

  it('should register layouts', () => {
    const { result } = renderHook(() => useLayout())
    const layout = {}
    act(() => {
      result.current.operations.registerLayout(layout)
    })
    expect(result.current.models.layout).toBe(layout)
  })
})
