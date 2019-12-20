import { BlueprintAttributeType } from './types'

export class BlueprintAttribute {
  private attr: BlueprintAttributeType
  constructor(attr: BlueprintAttributeType) {
    this.attr = attr
  }

  public getName(): string {
    return this.attr.name
  }

  public getDescription(): string | undefined {
    return this.attr.description
  }

  public isArray() {
    return this.attr.dimensions && this.attr.dimensions === '*'
  }

  public static isArray(value: string) {
    return value === '*'
  }

  public isPrimitiveType(value: string): boolean {
    // dont make this a static method. Needs to read attribute types later?
    return ['string', 'number', 'integer', 'number', 'boolean'].includes(
      this.getAttributeType()
    )
  }

  /**
   * @Depecrated
   *
   * Use for easier migration of the BlueprintAttribute class
   * Later: check usages and remove this getter.x
   */
  public getBlueprintAttributeType(): BlueprintAttributeType {
    return this.attr
  }

  public getAttributeType(): string {
    console.log(this.attr.attributeType, this.attr.type)
    return this.attr.type
    // if (this.attr.attributeType) {
    //   return this.attr.attributeType
    // }
    // @todo remove when json files are migrated.
    // throw 'Attribute type is missing. Issue #446'
  }

  public isPrimitive(): boolean {
    //todo use AttributeTypes enum, available in the blueprint.
    return ['string', 'number', 'integer', 'boolean'].includes(this.attr.type)
  }

  public toString(): string {
    return JSON.stringify(this.attr)
  }
}
