import { Blueprint } from './domain/Blueprint'
import {
  BlueprintAttributeType,
  BlueprintType,
  UiRecipe,
  Entity,
  KeyValue,
} from './domain/types'
// @ts-ignore
import objectPath from 'object-path'
import { BlueprintAttribute } from './domain/BlueprintAttribute'
import { DmssAPI } from '@dmt/common'

interface IBlueprintSchema {
  getSchema: () => object
}

type SchemaProperty = {
  type: string
  enum?: any[]
  required?: boolean
  [key: string]: any
}

export class BlueprintSchema implements IBlueprintSchema {
  private schema: KeyValue = {
    type: 'object',
    properties: {},
  }
  private uiRecipe: UiRecipe
  private rootBlueprintType: BlueprintType | undefined
  private blueprintType: BlueprintType
  private blueprint: Blueprint
  private blueprintProvider: Function
  private dmssAPI = new DmssAPI()
  constructor(
    blueprintType: BlueprintType,
    uiRecipe: UiRecipe,
    blueprintProvider: Function,
    rootBlueprint?: BlueprintType | undefined
  ) {
    this.uiRecipe = uiRecipe
    this.rootBlueprintType = rootBlueprint
    this.blueprintType = blueprintType
    this.blueprint = new Blueprint(blueprintType)
    this.blueprintProvider = blueprintProvider
    objectPath.set(this.schema, 'required', this.getRequired(this.blueprint))
  }

  public async execute(document: Entity, blueprintProvider: Function) {
    const path = 'properties'

    return this.processAttributes(
      path,
      this.blueprint,
      document,
      this.blueprintType.attributes,
      blueprintProvider,
      false
    )
  }

  private async processAttributes(
    path: string = '',
    blueprint: Blueprint,
    document: Entity,
    attributes: BlueprintAttributeType[],
    blueprintProvider: Function,
    exitRecursion: boolean
  ) {
    let blueprintAttributes: BlueprintAttribute[] = attributes.map(
      (attrType: BlueprintAttributeType) => new BlueprintAttribute(attrType)
    )
    if (this.uiRecipe.name) {
      blueprintAttributes = blueprintAttributes.filter(
        blueprint.filterAttributesByUiRecipe(this.uiRecipe.name)
      )
    }

    const skip: string[] = this.getNotContained(blueprint)

    await Promise.all(
      blueprintAttributes.map(async (attribute: BlueprintAttribute) => {
        const newPath = BlueprintSchema.createAttributePath(
          path,
          attribute.getName()
        )

        if (!skip.includes(attribute.getName())) {
          if (attribute.isPrimitive()) {
            await this.appendPrimitive(
              newPath,
              blueprint,
              attribute.getBlueprintAttributeType(),
              blueprintProvider
            )
          } else if (
            this.willProcessComplexAttribute(attribute.getName(), document)
          ) {
            //if (Object.keys(document[attribute.getName()]).length !== 0) {  //only display complex attributes if they are not empty - DOES NOT WORK SINCE IT HIDES STUFF FOR BLUEPRINTS.
            await this.processNested(
              newPath,
              document,
              attribute.getBlueprintAttributeType(),
              blueprintProvider,
              exitRecursion
            )
          }
        }
      })
    )
  }

  private static createAttributePath(path: string, name: string) {
    return path.length === 0 ? name : path + `.${name}`
  }

  private async processNested(
    path: string,
    nestedDocument: Entity,
    attrType: BlueprintAttributeType,
    blueprintProvider: Function,
    exitRecursion: boolean
  ): Promise<void> {
    const attr = new BlueprintAttribute(attrType)

    const nestedBlueprintType:
      | BlueprintType
      | undefined = await blueprintProvider(attr.getAttributeType())

    if (nestedBlueprintType) {
      const nestedBlueprint = new Blueprint(nestedBlueprintType)

      if (this.blueprint.isArray(attrType)) {
        const newPath = path + '.items.properties'
        objectPath.set(this.schema, path, {
          type: 'array',
          items: {
            required: this.getRequired(nestedBlueprint),
            properties: {},
          },
        })
        if (
          // !exitRecursion &&
          nestedDocument &&
          nestedDocument[attr.getName()]
        ) {
          if (nestedDocument[attrType.name].length === 0) {
            // stops recursion in the next level.
            // do only one more recursion after this flag is changed.
            exitRecursion = true
          }
          await this.processAttributes(
            newPath,
            nestedBlueprint,
            nestedDocument[attr.getName()][0],
            nestedBlueprintType.attributes,
            blueprintProvider,
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
          exitRecursion = attr.isPrimitive() ? true : false

          await this.processAttributes(
            newPath,
            nestedBlueprint,
            nestedDocument[attr.getName()],
            nestedBlueprintType.attributes,
            blueprintProvider,
            exitRecursion
          )
        }
      }
    }
  }

  private async appendPrimitive(
    path: string,
    blueprint: Blueprint,
    attr: BlueprintAttributeType,
    blueprintProvider: Function
  ) {
    if (this.blueprint.isArray(attr)) {
      objectPath.set(this.schema, path, {
        type: 'array',
        items: await this.createSchemaProperty(
          blueprint,
          attr,
          blueprintProvider
        ),
      })
    } else {
      objectPath.set(
        this.schema,
        path,
        await this.createSchemaProperty(blueprint, attr, blueprintProvider)
      )
    }
  }

  private async createSchemaProperty(
    blueprint: Blueprint,
    attrType: BlueprintAttributeType,
    blueprintProvider: Function
  ): Promise<SchemaProperty> {
    const attr = new BlueprintAttribute(attrType)
    let defaultValue: any = blueprint.isArray(attrType) ? '' : attr.getDefault()
    if (defaultValue) {
      if (attr.getAttributeType() === 'boolean') {
        defaultValue = defaultValue === 'false' ? false : true
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
    await this.addEnumToProperty(
      blueprint,
      schemaProperty,
      attrType,
      blueprintProvider
    )
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

  getNotContained(blueprint: Blueprint) {
    const uiAttributes: KeyValue | undefined = blueprint.getUiAttributes(
      this.uiRecipe.name
    )
    if (uiAttributes) {
      return Object.values(uiAttributes)
        .filter((attr: any) => 'contained' in attr && !attr.contained)
        .map((attr: any) => attr.name)
    }
    return []
  }

  getSchema() {
    return this.schema
  }

  private async addEnumToProperty(
    blueprint: Blueprint,
    property: SchemaProperty,
    attr: BlueprintAttributeType,
    blueprintProvider: Function
  ): Promise<void> {
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
      property.title = attr.name
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
    else if (
      attr.enumType &&
      typeof attr.enumType === 'string' &&
      attr.name !== 'type'
    ) {
      const dataSourceId: string = attr.enumType.split('/', 1)[0]
      const path: string = attr.enumType.split('/').slice(1).join('/')

      const response = await this.dmssAPI
        .getDocumentByPath(dataSourceId, path)
        .catch((error) => {
          throw new Error(
            `Could not fetch document by path: ${dataSourceId}/${path}. (${error})`
          )
        })
      const document = response
      if (document) {
        property.title = attr.name
        property.type = 'string'
        property.default = ''
        property.anyOf = document.values.map((value: any, index: number) => {
          return {
            type: 'string',
            title: document.labels[index],
            enum: [value],
          }
        })
      }
    }
  }

  private willProcessComplexAttribute(attributeName: string, document: Entity) {
    if (!document) {
      return true
    } else if (Array.isArray(document[attributeName])) {
      return true
    } else if (Object.keys(document[attributeName]).length === 0) {
      return false
    } else {
      return true
    }
  }
}
