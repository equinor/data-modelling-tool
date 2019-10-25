import { createFormConfigs, FormConfig } from '../CreateConfig'
import car from './car_test.json'
import blueprint from './blueprint_test.json'

describe.skip('CreateFormConfig', () => {
  let configs: FormConfig[] = []
  beforeEach(() => {
    configs = createFormConfigs(blueprint, car)
  })

  it('should have config for attributes', () => {
    const config: FormConfig | undefined = configs.find(
      config => config.attribute.name === 'attributes'
    )
    if (config) {
      console.log(config.template)
    }
  })
})
