import { Blueprint } from '../../domain/Blueprint'
import {
  BlueprintAttributeType,
  BlueprintType,
  UiRecipe,
  Entity,
  KeyValue,
} from '../../domain/types'
import { BlueprintProvider } from '../BlueprintProvider'
import objectPath from 'object-path'
import { IndexFilter } from './CreateConfig'
import { BlueprintAttribute } from '../../domain/BlueprintAttribute'

interface IBlueprintSchema {
  getSchema: () => object
}

type SchemaProperty = {
  type: string
  enum?: any[]
  required?: boolean
  [key: string]: any
}

export class BlueprintSchema extends Blueprint implements IBlueprintSchema {
  private schema: KeyValue = {
    type: 'object',
    properties: {},
  }
  private uiRecipe: UiRecipe
  private blueprintProvider: BlueprintProvider
  private filter: (attr: BlueprintAttributeType) => boolean
  private rootBlueprintType: BlueprintType | undefined

  constructor(
    blueprintType: BlueprintType,
    document: Entity,
    blueprintProvider: BlueprintProvider,
    uiRecipe: UiRecipe,
    filter: IndexFilter,
    rootBlueprint: BlueprintType | undefined
  ) {
    super(blueprintType)
    this.filter = filter
    this.uiRecipe = uiRecipe
    this.rootBlueprintType = rootBlueprint
    this.blueprintProvider = blueprintProvider
    const path = 'properties'
    objectPath.set(this.schema, 'required', this.getRequired(this))
    this.processAttributes(
      path,
      this,
      document,
      blueprintType.attributes,
      false
    )
  }

  private processAttributes(
    path: string = '',
    blueprint: Blueprint,
    document: Entity,
    attributes: BlueprintAttributeType[],
    exitRecursion: boolean
  ) {
    attributes
      .filter(this.filter) //@todo filter recursively on recipes and defaults.
      .map(
        (attrType: BlueprintAttributeType) => new BlueprintAttribute(attrType)
      )
      .forEach((attr: BlueprintAttribute) => {
        const newPath = BlueprintSchema.createAttributePath(
          path,
          attr.getName()
        )
        if (attr.isPrimitive()) {
          this.appendPrimitive(
            newPath,
            blueprint,
            attr.getBlueprintAttributeType()
          )
        } else {
          this.processNested(
            newPath,
            document,
            attr.getBlueprintAttributeType(),
            exitRecursion
          )
        }
      })
  }

  private static createAttributePath(path: string, name: string) {
    return path.length === 0 ? name : path + `.${name}`
  }

  private processNested(
    path: string,
    nestedDocument: Entity,
    attrType: BlueprintAttributeType,
    exitRecursion: boolean
  ): void {
    const attr = new BlueprintAttribute(attrType)
    const nestedBlueprintType:
      | BlueprintType
      | undefined = this.blueprintProvider.getBlueprintByType(
      attr.getAttributeType()
    )
    if (nestedBlueprintType) {
      const nestedBlueprint = new Blueprint(nestedBlueprintType)

      if (this.isArray(attrType)) {
        const newPath = path + '.items.properties'
        objectPath.set(this.schema, path, {
          type: 'array',
          items: {
            required: this.getRequired(nestedBlueprint),
            properties: {},
          },
        })
        if (
          !exitRecursion &&
          nestedDocument &&
          nestedDocument[attr.getName()]
        ) {
          if (nestedDocument[attrType.name].length === 0) {
            // stops recursion in the next level.
            // do only one more recursion after this flag is changed.
            exitRecursion = true
          }
          this.processAttributes(
            newPath,
            nestedBlueprint,
            nestedDocument[attr.getName()][0],
            nestedBlueprintType.attributes,
            exitRecursion
          )
        }
      } else {
        const newPath = path + '.properties'
        objectPath.set(this.schema, path, {
          type: 'object',
          required: this.getRequired(nestedBlueprint),
          properties: {},
        })

        if (!exitRecursion) {
          this.processAttributes(
            newPath,
            nestedBlueprint,
            nestedDocument[attr.getName()],
            nestedBlueprintType.attributes,
            true
          )
        }
      }
    }
  }

  private appendPrimitive(
    path: string,
    blueprint: Blueprint,
    attr: BlueprintAttributeType
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
    attrType: BlueprintAttributeType
  ): SchemaProperty {
    const attr = new BlueprintAttribute(attrType)
    let defaultValue: any = blueprint.isArray(attrType) ? '' : attrType.default
    if (defaultValue) {
      if (attr.getAttributeType() === 'boolean') {
        defaultValue = defaultValue === 'true' ? true : false
      }
      if (
        attr.getAttributeType() === 'integer' ||
        attr.getAttributeType() === 'number'
      ) {
        defaultValue = Number(defaultValue)
      }
    }

    let schemaProperty: SchemaProperty = {
      type: attr.getAttributeType(),
    }
    if (defaultValue) {
      schemaProperty.default = defaultValue
    }
    this.addEnumToProperty(blueprint, schemaProperty, attrType)
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
    attr: BlueprintAttributeType
  ): void {
    const attrBlueprintName = blueprint.getBlueprintType().name
    if (
      this.rootBlueprintType &&
      attr.name === 'name' &&
      ['BlueprintAttribute', 'UiAttribute', 'StorageAttribute'].includes(
        attrBlueprintName
      )
    ) {
      const validNames = this.rootBlueprintType.attributes.map(
        (attr: BlueprintAttributeType) => attr.name
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
