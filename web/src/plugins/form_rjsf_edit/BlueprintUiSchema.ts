import { Blueprint, KeyValue } from '../Blueprint'
import {
  BlueprintAttribute,
  Blueprint as BlueprintType,
  UiRecipe,
  Entity,
} from '../types'
import { BlueprintProvider } from '../BlueprintProvider'
import { UiSchema } from 'react-jsonschema-form'
import objectPath from 'object-path'
import { IndexFilter } from './CreateConfig'

interface IBlueprintSchema {
  getSchema: () => object
}

const defaults: KeyValue = {
  name: { 'ui:disabled': true },
  type: { 'ui:disabled': true },
  description: { 'ui:widget': 'textarea' },
}

/**
 * Adapter for document to rsjf uiSchema.
 * https://department-of-veterans-affairs.github.io/veteran-facing-services-tools/forms/about-the-schema-and-uischema-objects/
 *
 */
export class BlueprintUiSchema extends Blueprint implements IBlueprintSchema {
  private schema: any = {}
  private blueprintProvider: BlueprintProvider
  private uiRecipe: UiRecipe
  private filter: IndexFilter

  constructor(
    blueprint: BlueprintType,
    blueprintProvider: BlueprintProvider,
    uiRecipe: UiRecipe,
    filter: IndexFilter
  ) {
    super(blueprint)
    this.uiRecipe = uiRecipe
    this.filter = filter
    this.blueprintProvider = blueprintProvider

    // add defaults before the recursive part.
    // defaults can be overridden in uiRecipe.
    Object.keys(defaults).forEach((key: string) => {
      this.schema[key] = defaults[key]
    })

    this.processAttributes('', this, blueprint.attributes)
  }

  private processAttributes(
    path: string = '',
    blueprint: Blueprint,
    attributes: BlueprintAttribute[]
  ) {
    attributes.filter(this.filter).forEach((attr: BlueprintAttribute) => {
      const uiAttribute = blueprint.getUiAttribute(
        this.uiRecipe.name,
        attr.name
      )
      const newPath = this.createAttributePath(path, attr.name)
      if (this.isPrimitive(attr.type) || (uiAttribute && uiAttribute.field)) {
        this.appendPrimitive(newPath, blueprint, attr, uiAttribute)
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
      if (nestedBlueprintType.name === blueprint.getBlueprintType().name) {
        console.log(
          'EditPlugin uiSchema does not support self recursive types.'
        )
        return
      }
      const nestedBlueprint = new Blueprint(nestedBlueprintType)
      if (this.isArray(attr)) {
        const newPath = path + '.items'
        objectPath.set(this.schema, newPath, { items: {} })
        // update reference to nested item
        this.processAttributes(
          newPath,
          nestedBlueprint,
          nestedBlueprintType.attributes
        )
      } else {
        // update reference to nested item
        this.processAttributes(
          path,
          nestedBlueprint,
          nestedBlueprintType.attributes
        )
      }
    }
  }

  private appendPrimitive(
    path: string,
    blueprint: Blueprint,
    attr: BlueprintAttribute,
    uiAttr: any
  ) {
    if (this.isArray(attr)) {
      objectPath.set(this.schema, path + '.items', { items: {} })
      this.appendSchemaProperty(path, blueprint, attr, uiAttr)
    } else {
      this.appendSchemaProperty(path, blueprint, attr, uiAttr)
    }
  }

  private appendSchemaProperty(
    path: string,
    blueprint: Blueprint,
    attr: BlueprintAttribute,
    uiAttribute: any
  ): void {
    //@todo use uiAttribute to build the schema property. required, descriptions etc.
    const uiSchemaProperty: UiSchema = {}
    if (uiAttribute) {
      if (uiAttribute.widget) {
        uiSchemaProperty['ui:widget'] = uiAttribute.widget
      }
      if (uiAttribute.description) {
        uiSchemaProperty['ui:description'] = uiAttribute.description
      } else if (attr.description) {
        uiSchemaProperty['ui:description'] = attr.description
      }
      if (uiAttribute.disabled) {
        if (attr.default === '') {
          console.warn(
            `please provide a defaultValue when attribute is disabled from editing, attr: ${attr}`
          )
        }
        uiSchemaProperty['ui:disabled'] = true
      }
      if (uiAttribute.field === 'attribute') {
        const fieldBlueprint = this.blueprintProvider.getBlueprintByType(
          attr.type
        )
        const fieldProperty = {
          'ui:field': uiAttribute.field,
          attributes: (fieldBlueprint && fieldBlueprint.attributes) || [],
        }
        // attribute widget should be in an array.
        objectPath.set(this.schema, path, { items: fieldProperty })
      } else if (uiAttribute.field) {
        uiSchemaProperty['ui:field'] = uiAttribute.field
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
