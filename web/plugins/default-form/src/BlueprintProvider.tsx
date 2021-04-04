import { BlueprintType, Dto } from './domain/types'

interface BlueprintProviderProps {
  explorer?: any
}

export class BlueprintProvider {
  private explorer: any

  constructor(explorer: BlueprintProviderProps) {
    this.explorer = explorer
  }

  async getBlueprintByType(type: string): Promise<any | undefined> {
    try {
      const current = type.split('/')
      const document = await this.explorer.getByPath({
        dataSourceId: current.shift(),
        path: current.join('/'),
      })
      return document.document
    } catch (error) {
      console.log(type, error)
    }
    return null
  }

  async getDtoByType(type: string): Promise<any | undefined> {
    try {
      const current = type.split('/')
      const document = await this.explorer.getByPath({
        dataSourceId: current.shift(),
        path: current.join('/'),
      })
      return document.document

    } catch (error) {
      console.log(type, error)
    }
    return null
  }
}