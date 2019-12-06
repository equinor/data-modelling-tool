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
  private rootBlueprint: BlueprintType | undefined

  constructor(
    blueprintType: BlueprintType,
    blueprintProvider: BlueprintProvider,
    uiRecipe: UiRecipe,
    filter: IndexFilter,
    rootBlueprint: BlueprintType | undefined
  ) {
    super(blueprintType)
    this.filter = filter
    this.uiRecipe = uiRecipe
    this.rootBlueprint = rootBlueprint
    this.blueprintProvider = blueprintProvider
    const path = 'properties'
    objectPath.set(this.schema, 'required', this.getRequired(this))
    this.processAttributes(path, this, blueprintType.attributes)
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
          this.appendPrimitive(newPath, blueprint, attr)
        } else {
          this.processNested(newPath, blueprint, attr)
        }
      })
  }

  private createAttributePath(path: string, name: string) {
    return path.length === 0 ? name : path + `.${name}`
  }

  private processNested(
    path: string,
    blueprint: Blueprint,
    attr: BlueprintAttribute
  ): void {
    const nestedBlueprintType:
      | BlueprintType
      | undefined = this.blueprintProvider.getBlueprintByType(attr.type)
    if (nestedBlueprintType) {
      const nestedBlueprint = new Blueprint(nestedBlueprintType)
      if (nestedBlueprintType.name === blueprint.getBlueprintType().name) {
        console.log('EditPlugin schema does not support self recursive types.')
        return
      }

      if (this.isArray(attr)) {
        if (
          nestedBlueprint.getBlueprintType().name !==
          blueprint.getBlueprintType().name
        ) {
          const newPath = path + '.items.properties'
          console.log(attr, nestedBlueprintType, path)
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
        }
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

  private appendPrimitive(
    path: string,
    blueprint: Blueprint,
    attr: BlueprintAttribute
  ) {
    if (this.isArray(attr)) {
      objectPath.set(this.schema, path, {
        type: 'array',
        items: this.createSchemaProperty(blueprint, attr),
      })
    } else {
      objectPath.set(
        this.schema,
        path,
        this.createSchemaProperty(blueprint, attr)
      )
    }
  }

  private createSchemaProperty(
    blueprint: Blueprint,
    attr: BlueprintAttribute
  ): SchemaProperty {
    let defaultValue: any = attr.default
    if (defaultValue) {
      if (attr.type === 'boolean') {
        defaultValue = defaultValue === 'true' ? true : false
      }
      if (attr.type === 'integer' || attr.type === 'number') {
        defaultValue = Number(defaultValue)
      }
    }

    let schemaProperty: SchemaProperty = {
      type: attr.type,
      default: defaultValue,
    }
    this.addEnumToProperty(blueprint, schemaProperty, attr)
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
    blueprint: Blueprint,
    property: SchemaProperty,
    attr: BlueprintAttribute
  ): void {
    const attrBlueprintName = blueprint.getBlueprintType().name
    if (
      this.rootBlueprint &&
      attr.name === 'name' &&
      ['BlueprintAttribute', 'UiAttribute', 'StorageAttribute'].includes(
        attrBlueprintName
      )
    ) {
      const validNames = this.rootBlueprint.attributes.map(
        (attr: BlueprintAttribute) => attr.name
      )
      //create an enum for valid names.
      property.title = 'name'
      property.type = 'string'
      property.default = ''

      // add empty option.
      property.anyOf = ['']
        .concat(validNames)
        .map((value: any, index: number) => {
          return {
            type: 'string',
            title: value,
            enum: [value],
          }
        })
    }

    //@todo pass uiAttribute to only add enum if desired?
    else if (attr.enumType && attr.name !== 'type') {
      const dto = this.blueprintProvider.getDtoByType(attr.enumType)
      if (dto) {
        property.title = 'name'
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
