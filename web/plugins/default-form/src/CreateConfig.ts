import { BlueprintUiSchema } from './BlueprintUiSchema'
import { BlueprintSchema } from './BlueprintSchema'

export type FormConfig = {
  schema: any
  uiSchema: any
  blueprint: any
  type: string
}

export async function createFormConfigs(pluginProps: any): Promise<FormConfig> {
  const { type, document, uiRecipeName, blueprintProvider } = pluginProps

  const rootBlueprint = undefined

  const blueprint = await blueprintProvider.getBlueprintByType(type)

  if (!blueprint) throw `Did not found the blueprint ${type}`

  const uiRecipe = blueprint.uiRecipes.find((uiRecipe: any) => uiRecipe.name === uiRecipeName) || {}

  console.log('Using UI recipe:', uiRecipe)

  const schemaGenerator = new BlueprintSchema(
    blueprint,
    uiRecipe,
    rootBlueprint,
  )
  await schemaGenerator.execute(document, blueprintProvider)
  const schema = schemaGenerator.getSchema()

  const uiSchemaGenerator = new BlueprintUiSchema(
    blueprint,
    uiRecipe,
    uiRecipeName
  )
  await uiSchemaGenerator.execute(blueprintProvider)
  const uiSchema = uiSchemaGenerator.getSchema()

  return {
    type,
    blueprint,
    schema,
    uiSchema,
  }
}
