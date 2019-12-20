import { BlueprintAttributeType } from '../plugins/types'

export class BlueprintAttribute {
  private attr: BlueprintAttributeType
  constructor(attr: BlueprintAttributeType) {
    this.attr = attr
  }

  public isArray() {
    return this.attr.dimensions && this.attr.dimensions === '*'
  }

  public static isArray(value: string) {
    return value === '*'
  }
}
