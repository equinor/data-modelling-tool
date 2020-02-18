import { BlueprintType, Dto } from '../domain/types'

type GetBlueprint = (dto: Dto) => BlueprintType | undefined
type GetEntity = (dto: Dto) => Dto | undefined

interface IBlueprintProvider {
  getBlueprint: GetBlueprint
  getEntity: GetEntity
}

export class BlueprintProvider implements IBlueprintProvider {
  private blueprintTypes: BlueprintType[]
  private dtos: Dto[]

  constructor(blueprintTypes: BlueprintType[], dtos: Dto[]) {
    this.blueprintTypes = blueprintTypes
    this.dtos = dtos
  }

  public getNameFromType(type: string): string {
    if (type && type.indexOf('/') > -1) {
      const split = type.split('/')
      return split[split.length - 1]
    }
    return ''
  }

  getBlueprintByType(type: string): BlueprintType | undefined {
    const name = this.getNameFromType(type)
    return this.blueprintTypes.find(
      (blueprintType: BlueprintType) => blueprintType.name === name
    )
  }

  getDtoByType(type: string): Dto | undefined {
    const name = this.getNameFromType(type)
    return this.dtos.find((dto: Dto) => dto.data.name === name)
  }

  getBlueprint(dto: Dto): BlueprintType | undefined {
    //@todo use uid of dto.
    throw 'not implemented'
  }

  getEntity(dto: Dto): Dto | undefined {
    throw 'not implemented'
  }
}
