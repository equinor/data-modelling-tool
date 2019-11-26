import { Blueprint, Dto } from './types'

type GetBlueprint = (dto: Dto) => Blueprint | undefined
type GetEntity = (dto: Dto) => Dto | undefined

interface IBlueprintProvider {
  getBlueprint: GetBlueprint
  getEntity: GetEntity
}

export class BlueprintProvider implements IBlueprintProvider {
  private blueprints: Blueprint[]

  constructor(blueprints: Blueprint[]) {
    this.blueprints = blueprints
  }

  getBlueprintByType(type: string) {
    const split = type.split('/')
    const name = split[split.length - 1]
    return this.blueprints.find(
      (blueprint: Blueprint) => blueprint.name === name
    )
  }

  getBlueprint(dto: Dto): Blueprint | undefined {
    //@todo use uid of dto.
    throw 'not implemented'
  }

  getEntity(dto: Dto): Dto | undefined {
    throw 'not implemented'
  }
}
