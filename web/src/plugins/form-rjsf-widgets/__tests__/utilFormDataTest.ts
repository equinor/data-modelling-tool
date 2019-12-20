import { castValues } from '../utilFormData'
import { BlueprintType } from '../../types'

const emptyBlueprintType: BlueprintType = {
  name: '',
  type: '',
  description: '',
  uiRecipes: [],
  storageRecipes: [],
  attributes: [],
}

describe('utilFormDataTest', () => {
  it('should cast boolean', () => {
    const entity = {
      boolValue: 'true',
    }
    const attributes = [
      {
        name: 'boolValue',
        type: 'boolean',
      },
    ]

    const entityCasted = castValues(
      { ...emptyBlueprintType, attributes },
      entity
    )
    expect(entityCasted.boolValue).toEqual(true)
  })

  it('should cast integer', () => {
    const entity = {
      intValue: '12',
    }
    const attributes = [
      {
        name: 'intValue',
        type: 'number',
      },
    ]

    const entityCasted = castValues(
      { ...emptyBlueprintType, attributes },
      entity
    )
    expect(entityCasted.intValue).toEqual(12)
  })

  it('should cast number', () => {
    const entity = {
      numberValue: '12.4',
    }
    const attributes = [
      {
        name: 'numberValue',
        type: 'number',
      },
    ]

    const entityCasted = castValues(
      { ...emptyBlueprintType, attributes },
      entity
    )
    expect(entityCasted.numberValue).toEqual(12.4)
  })

  it('should fail to cast number', () => {
    const entity = {
      numberValue: '12.4 typo',
    }
    const attributes = [
      {
        name: 'numberValue',
        type: 'number',
      },
    ]

    const entityCasted = castValues(
      { ...emptyBlueprintType, attributes },
      entity
    )
    expect(entityCasted.numberValue).toEqual(NaN)
  })
})
