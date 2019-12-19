import { BlueprintAttribute } from './types'

export class Dimension {
  private attr: BlueprintAttribute
  constructor(attr: BlueprintAttribute) {
    this.attr = attr
  }

  public isArray() {
    return this.attr.dimensions && this.attr.dimensions === '*'
  }

  public static isArray(value: string) {
    return value === '*'
  }
}
