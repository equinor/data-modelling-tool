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
    return this.attr.attributeType
  }

  public isPrimitive(): boolean {
    //todo use AttributeTypes enum, available in the blueprint.
    return ['string', 'number', 'integer', 'boolean'].includes(
      this.attr.attributeType
    )
  }

  public toString(): string {
    return JSON.stringify(this.attr)
  }
}