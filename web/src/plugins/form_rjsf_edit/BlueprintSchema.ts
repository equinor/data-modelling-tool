import { Blueprint, KeyValue } from '../Blueprint'
import {
  BlueprintAttribute,
  Blueprint as BlueprintType,
  UiRecipe,
} from '../types'
import { BlueprintProvider } from '../BlueprintProvider'
import objectPath from 'object-path'
import { IndexFilter } from './CreateConfig'

interface IBlueprintSchema {
  getSchema: () => object
}

type SchemaProperty = {
  type: string
  enum?: any[]
  required?: boolean
  [key: string]: any
}

//@todo make uiAttribute recursive, like BlueprintUiSchema, needed to set required
export class BlueprintSchema extends Blueprint implements IBlueprintSchema {
  private schema: KeyValue = {
    type: 'object',
    properties: {},
  }
  private uiRecipe: UiRecipe
  private blueprintProvider: BlueprintProvider
  private filter: (attr: BlueprintAttribute) => boolean

  constructor(
    blueprint: BlueprintType,
    blueprintProvider: BlueprintProvider,
    uiRecipe: UiRecipe,
    filter: IndexFilter
  ) {
    super(blueprint)
    this.filter = filter
    this.uiRecipe = uiRecipe
    this.blueprintProvider = blueprintProvider
    const path = 'properties'
    objectPath.set(this.schema, 'required', this.getRequired(this))
    this.processAttributes(path, this, blueprint.attributes)
  }

  private processAttributes(
    path: string = '',
    blueprint: Blueprint,
    attributes: BlueprintAttribute[]
  ) {
    attributes
      .filter(this.filter) //@todo filter recursively on recipes and defaults.
      .forEach((attr: BlueprintAttribute) => {
        const newPath = this.createAttributePath(path, attr.name)

        if (this.isPrimitive(attr.type)) {
          this.appendPrimitive(newPath, attr)
        } else {
          this.processNested(newPath, attr)
        }
      })
  }

  private createAttributePath(path: string, name: string) {
    return path.length === 0 ? name : path + `.${name}`
  }

  private processNested(path: string, attr: BlueprintAttribute): void {
    if (this.isPrimitive(attr.type)) {
      this.appendPrimitive(path, attr)
    } else {
      const nestedBlueprintType:
        | BlueprintType
        | undefined = this.blueprintProvider.getBlueprintByType(attr.type)
      if (nestedBlueprintType) {
        const nestedBlueprint = new Blueprint(nestedBlueprintType)
        if (this.isArray(attr)) {
          const newPath = path + '.items.properties'
          objectPath.set(this.schema, path, {
            type: 'array',
            items: {
              required: this.getRequired(nestedBlueprint),
              properties: {},
            },
          })
          this.processAttributes(
            newPath,
            nestedBlueprint,
            nestedBlueprintType.attributes
          )
        } else {
          const newPath = path + '.properties'
          objectPath.set(this.schema, path, {
            type: 'object',
            required: this.getRequired(nestedBlueprint),
            properties: {},
          })
          this.processAttributes(
            newPath,
            nestedBlueprint,
            nestedBlueprintType.attributes
          )
        }
      }
    }
  }

  private appendPrimitive(path: string, attr: BlueprintAttribute) {
    if (this.isArray(attr)) {
      objectPath.set(this.schema, path, {
        type: 'array',
        items: this.createSchemaProperty(attr),
      })
    } else {
      objectPath.set(this.schema, path, this.createSchemaProperty(attr))
    }
  }

  private createSchemaProperty(attr: BlueprintAttribute): SchemaProperty {
    let schemaProperty: SchemaProperty = {
      type: attr.type,
    }
    this.addEnumToProperty(schemaProperty, attr)
    return schemaProperty
  }

  getRequired(blueprint: Blueprint) {
    const uiAttributes: KeyValue | undefined = blueprint.getUiAttributes(
      this.uiRecipe.name
    )
    if (uiAttributes) {
      return Object.values(uiAttributes)
        .filter((attr: any) => attr.required)
        .map((attr: any) => attr.name)
    }
    return []
  }

  getSchema() {
    return this.schema
  }

  private addEnumToProperty(
    property: SchemaProperty,
    attr: BlueprintAttribute
  ): void {
    //@todo pass uiAttribute to only add enum if desired?
    if (attr.enumType) {
      const dto = this.blueprintProvider.getDtoByType(attr.enumType)
      if (dto) {
        property.title = dto.data.name
        property.type = 'string'
        property.default = ''
        property.anyOf = dto.data.values.map((value: any, index: number) => {
          return {
            type: 'string',
            title: dto.data.labels[index],
            enum: [value],
          }
        })
      }
    }
  }
}
