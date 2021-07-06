import { Blueprint } from './domain/Blueprint'
import {
  BlueprintAttributeType,
  BlueprintType,
  KeyValue,
  UiRecipe,
} from './domain/types'
import { UiSchema } from 'react-jsonschema-form'
// @ts-ignore
import objectPath from 'object-path'
import { BlueprintAttribute } from './domain/BlueprintAttribute'

interface IBlueprintSchema {
  getSchema: () => object
}

const disabledProperty = { 'ui:disabled': true }
const textAreaProperty = { 'ui:widget': 'textarea' }

const defaults: KeyValue = {
  name: disabledProperty,
  type: disabledProperty,
  description: textAreaProperty,
}

const defaultsCreate: KeyValue = {
  type: disabledProperty,
  description: textAreaProperty,
}

/**
 * Adapter for document to rsjf uiSchema.
 * https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/about-the-schema-and-uischema-objects/
 *
 */
export class BlueprintUiSchema implements IBlueprintSchema {
  private schema: any = {}
  private uiRecipe: UiRecipe
  private blueprintType: BlueprintType
  private inputBlueprint: Blueprint
  private blueprintProvider: Function

  constructor(
    blueprintType: BlueprintType,
    uiRecipe: UiRecipe,
    uiRecipeName: string,
    blueprintProvider: Function
  ) {
    this.uiRecipe = uiRecipe
    this.blueprintType = blueprintType
    this.inputBlueprint = new Blueprint(blueprintType)
    this.blueprintProvider = blueprintProvider
    // add defaults before the recursive part.
    // defaults can be overridden in uiRecipe.
    if (uiRecipeName == 'DEFAULT_CREATE') {
      this.schema = defaultsCreate
    } else {
      this.schema = defaults
    }
  }

  // @ts-ignore
  public async execute(blueprintProvider: Function) {
    return this.processAttributes(
      '',
      this.inputBlueprint,
      this.blueprintType.attributes,
      this.blueprintProvider
    )
  }

  private async processAttributes(
    path: string = '',
    blueprint: Blueprint,
    attributes: BlueprintAttributeType[],
    blueprintProvider: Function
  ) {
    let listOfAttr = attributes.map(
      (attrType) => new BlueprintAttribute(attrType)
    )
    if (this.uiRecipe.name) {
      listOfAttr = listOfAttr.filter(
        blueprint.filterAttributesByUiRecipe(this.uiRecipe.name)
      )
    }
    return await Promise.all(
      listOfAttr.map(async (attr: BlueprintAttribute) => {
        const attrName = attr.getName()

        const uiAttribute = blueprint.getUiAttribute(
          this.uiRecipe.name,
          attrName
        )

        const newPath = BlueprintUiSchema.createAttributePath(path, attrName)

        if (attr.isComplexArray()) {
          objectPath.set(this.schema, newPath, { 'ui:field': 'matrix' })
        } else {
          if (
            this.inputBlueprint.isPrimitive(attr.getAttributeType()) ||
            (uiAttribute && uiAttribute.field)
          ) {
            return this.appendPrimitive(
              newPath,
              attr,
              uiAttribute,
              blueprintProvider
            )
          } else {
            await this.processNested(
              newPath,
              blueprint,
              attr,
              blueprintProvider
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
    blueprint: Blueprint,
    attr: BlueprintAttribute,
    blueprintProvider: Function
  ): Promise<void> {
    const nestedBlueprintType:
      | BlueprintType
      | undefined = await blueprintProvider(attr.getAttributeType())

    if (nestedBlueprintType) {
      if (nestedBlueprintType.name === blueprint.getBlueprintType().name) {
        console.log(
          'EditPlugin uiSchema does not support self recursive types.'
        )
        return
      }
      const nestedBlueprint = new Blueprint(nestedBlueprintType)
      if (attr.isArray()) {
        const newPath = path + '.items'
        objectPath.set(this.schema, newPath, {
          type: disabledProperty,
          description: textAreaProperty,
        })

        // update reference to nested item
        await this.processAttributes(
          newPath,
          nestedBlueprint,
          nestedBlueprintType.attributes,
          blueprintProvider
        )
      } else {
        // update reference to nested item¨
        objectPath.set(this.schema, path, defaults)
        await this.processAttributes(
          path,
          nestedBlueprint,
          nestedBlueprintType.attributes,
          blueprintProvider
        )
      }
    }
  }

  private async appendPrimitive(
    path: string,
    attr: BlueprintAttribute,
    uiAttr: any,
    blueprintProvider: Function
  ) {
    if (attr.isArray()) {
      let newPath = path + '.items'
      // if 'forEachElement' is false on a uiAttribute, don't apply the widget to every child. But to the entire array
      if (uiAttr?.arrayField) {
        newPath = path
      }
      objectPath.set(this.schema, newPath, {})

      await this.appendSchemaProperty(newPath, attr, uiAttr, blueprintProvider)
    } else {
      await this.appendSchemaProperty(path, attr, uiAttr, blueprintProvider)
    }
  }

  private async appendSchemaProperty(
    path: string,
    attr: BlueprintAttribute,
    uiAttribute: any,
    blueprintProvider: Function
  ): Promise<void> {
    //@todo use uiAttribute to build the schema property. required, descriptions etc.
    const uiSchemaProperty: UiSchema = {}
    if (attr.getDescription()) {
      uiSchemaProperty['ui:description'] = attr.getDescription()
      if (attr.getAttributeType() === 'boolean') {
        uiSchemaProperty['ui:widget'] = 'checkbox'
      }
    }

    if (uiAttribute) {
      if (uiAttribute.widget) {
        uiSchemaProperty['ui:widget'] = uiAttribute.widget
      }

      // override attr description.
      if (uiAttribute.description) {
        // override attr description.
        // not possible to set ui:description on checkbox.
        // https://github.com/rjsf-team/react-jsonschema-form/issues/827
        uiSchemaProperty['ui:description'] = uiAttribute.description
        if (attr.getAttributeType() === 'boolean') {
          uiSchemaProperty['ui:widget'] = 'checkbox'
        }
      }
      if (uiAttribute.disabled) {
        if (attr.getBlueprintAttributeType().default === '') {
          console.warn(
            `please provide a defaultValue when attribute is disabled from editing, attr: ${attr}`
          )
        }
        uiSchemaProperty['ui:disabled'] = true
      }
      if (uiAttribute.helpText) {
        uiSchemaProperty['ui:help'] = uiAttribute.helpText
      }
      if (attr.getBlueprintAttributeType().label) {
        uiSchemaProperty['ui:label'] = attr.getBlueprintAttributeType().label
      }
      if (uiAttribute.field === 'attribute') {
        const fieldBlueprint = await blueprintProvider(attr.getAttributeType())
        const fieldProperty = {
          'ui:field': uiAttribute.field,
          attributes: (fieldBlueprint && fieldBlueprint.attributes) || [],
        }
        // attribute widget should be in an array.
        objectPath.set(this.schema, path, fieldProperty)
      } else if (uiAttribute.field) {
        uiSchemaProperty['ui:field'] = uiAttribute.field
      } else if (uiAttribute.arrayField) {
        uiSchemaProperty['ui:field'] = uiAttribute.arrayField
        uiSchemaProperty['ui:options'] = {
          removeable: false,
          addable: false,
        }
      }
    }
    if (Object.keys(uiSchemaProperty).length > 0) {
      //path = this.createAttributePath(path, attr.name)
      objectPath.set(this.schema, path, uiSchemaProperty)
    }
  }

  getSchema() {
    return this.schema
  }
}
