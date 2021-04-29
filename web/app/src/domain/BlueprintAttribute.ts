import { BlueprintAttributeType } from './types'

export class BlueprintAttribute {
  private attr: BlueprintAttributeType

  constructor(attr: BlueprintAttributeType) {
    this.attr = attr
  }

  public getName(): string {
    return this.attr.name
  }

  public getPrettyName(): string {
    return this.attr.name.charAt(0).toUpperCase() + this.attr.name.substr(1)
  }

  public getDescription(): string | undefined {
    return this.attr.description
  }

  public isArray() {
    return this.attr.dimensions && this.attr.dimensions === '*'
  }

  public isComplexArray() {
    return this.attr.dimensions?.includes(',')
  }

  public getDefault(): any {
    return this.attr.default
  }

  public static isArray(value: string) {
    return value !== ''
  }

  public isPrimitiveType(value: string): boolean {
    // dont make this a static method. Needs to read attribute types later?
    return ['string', 'number', 'integer', 'number', 'boolean'].includes(value)
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

  public getAttributeType(): string | undefined {
    return this.attr.attributeType
  }

  public isPrimitive(): boolean {
    //todo use AttributeTypes enum, available in the blueprint.
    return ['string', 'number', 'integer', 'boolean'].includes(
      this.attr.attributeType as string
    )
  }

  public toString(): string {
    return JSON.stringify(this.attr)
  }
}
