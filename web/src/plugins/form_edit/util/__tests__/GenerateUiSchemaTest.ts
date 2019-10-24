import { uiRecipeToUiSchema } from '../GenerateUiSchema'
import blueprint from './blueprint_test.json'
import car from './car_test.json'

describe('Generate uiSchema', () => {
  it('should generate uiSchema for a car', () => {
    const uiSchema = uiRecipeToUiSchema(blueprint, car, 'EDIT')
    expect((uiSchema as any)['description']).toEqual({
      'ui:widget': 'textarea',
    })
    expect((uiSchema as any)['uiRecipes']).toEqual({ 'ui:field': 'hidden' })
    expect((uiSchema as any)['storageRecipes']).toEqual({
      'ui:field': 'hidden',
    })
    console.log(uiSchema)
  })
})
