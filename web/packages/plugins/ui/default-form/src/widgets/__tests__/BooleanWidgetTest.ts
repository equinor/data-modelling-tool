import { getBooleanValue } from '../BooleanWidget'

describe('BooleanWidgetTest', () => {
  it('should be contained true', () => {
    const booleanValue: boolean = getBooleanValue(true, {
      name: 'contained',
      type: 'boolean',
    })
    expect(booleanValue).toEqual(true)
  })

  it('should be contained false', () => {
    const booleanValue: boolean = getBooleanValue(false, {
      name: 'contained',
      type: 'boolean',
    })
    expect(booleanValue).toEqual(false)
  })

  it('should be contained default false', () => {
    const booleanValue: boolean = getBooleanValue(undefined, {
      name: 'contained',
      type: 'boolean',
      default: 'false',
    })
    expect(booleanValue).toEqual(false)
  })

  it('should be contained default true', () => {
    const booleanValue: boolean = getBooleanValue(undefined, {
      name: 'contained',
      type: 'boolean',
      default: 'true',
    })
    expect(booleanValue).toEqual(true)
  })

  it('should default hard to false', () => {
    const booleanValue: boolean = getBooleanValue(undefined, {
      name: 'someBool',
      type: 'string',
    })
    expect(booleanValue).toEqual(false)
  })

  it('should default hard to false', () => {
    const booleanValue: boolean = getBooleanValue(undefined, {
      name: 'someBool',
      type: 'boolean',
      default: '',
    })
    expect(booleanValue).toEqual(false)
  })
})
