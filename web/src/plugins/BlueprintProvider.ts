import { Blueprint, Dto } from './types'

type GetBlueprint = (dto: Dto) => Blueprint | undefined
type GetEntity = (dto: Dto) => Dto | undefined

interface IBlueprintProvider {
  getBlueprint: GetBlueprint
  getEntity: GetEntity
}

export class BlueprintProvider implements IBlueprintProvider {
  private blueprints: Blueprint[]
  private dtos: Dto[]

  constructor(blueprints: Blueprint[], dtos: Dto[]) {
    this.blueprints = blueprints
    this.dtos = dtos
  }

  private getNameFromType(type: string): string {
    const split = type.split('/')
    return split[split.length - 1]
  }

  getBlueprintByType(type: string) {
    const name = this.getNameFromType(type)
    return this.blueprints.find(
      (blueprint: Blueprint) => blueprint.name === name
    )
  }

  getDtoByType(type: string): Dto | undefined {
    const name = this.getNameFromType(type)
    return this.dtos.find((dto: Dto) => dto.data.name === name)
  }

  getBlueprint(dto: Dto): Blueprint | undefined {
    //@todo use uid of dto.
    console.warn('not implemented')
    return
  }

  getEntity(dto: Dto): Dto | undefined {
    console.warn('not implemented')
    return
  }
}
