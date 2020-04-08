import { BlueprintProvider } from '../BlueprintProvider'
import { BlueprintUiSchema } from './BlueprintUiSchema'
import { BlueprintSchema } from './BlueprintSchema'
import { EditPluginProps } from './EditForm'

export type FormConfig = {
  data: any
  template: any
  uiSchema: any
}

export function createFormConfigs(pluginProps: EditPluginProps): FormConfig {
  const { document, blueprintTypes, uiRecipe, dtos } = pluginProps
  const blueprintType = pluginProps.blueprintType

  const blueprintProvider = new BlueprintProvider(blueprintTypes, dtos)
  const blueprintSchema = new BlueprintSchema(
    blueprintType,
    document,
    blueprintProvider,
    uiRecipe,
    pluginProps.rootDocument
  ).getSchema()
  const uiSchema = new BlueprintUiSchema(
    blueprintType,
    blueprintProvider,
    uiRecipe
  ).getSchema()

  return {
    data: document,
    template: blueprintSchema,
    uiSchema,
  }
}
