import { BlueprintUiSchema } from './BlueprintUiSchema'
import { BlueprintSchema } from './BlueprintSchema'

export type FormConfig = {
  schema: any
  uiSchema: any
  blueprint: any
  type: string
}

export async function createFormConfigs(props: any): Promise<FormConfig> {
  const { document, uiRecipeName, explorer, token } = props
  const rootBlueprint = undefined
  const type = document.type

  const blueprint = await explorer.getBlueprint(type)

  if (!blueprint) throw new Error(`Could not find the blueprint '${type}'`)

  const uiRecipe =
    blueprint.uiRecipes.find(
      (uiRecipe: any) => uiRecipe.name === uiRecipeName
    ) || {}

  const schemaGenerator = new BlueprintSchema(
    blueprint,
    uiRecipe,
    (typeRef: string) => explorer.getBlueprint(typeRef),
    token,
    rootBlueprint
  )
  await schemaGenerator.execute(document, (typeRef: string) =>
    explorer.getBlueprint(typeRef)
  )
  const schema = schemaGenerator.getSchema()

  const uiSchemaGenerator = new BlueprintUiSchema(
    blueprint,
    uiRecipe,
    uiRecipeName,
    (typeRef: string) => explorer.getBlueprint(typeRef)
  )
  await uiSchemaGenerator.execute((typeRef: string) =>
    explorer.getBlueprint(typeRef)
  )
  const uiSchema = uiSchemaGenerator.getSchema()

  return {
    type,
    blueprint,
    schema,
    uiSchema,
  }
}
