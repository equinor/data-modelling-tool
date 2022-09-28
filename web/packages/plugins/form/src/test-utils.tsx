import { DmssAPI } from '@development-framework/dm-core'

export const mockBlueprintGet = (blueprints: Array<any>) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'blueprintGet')
  //@ts-ignore
  mock.mockImplementation((props: any) =>
    Promise.resolve({
      data: blueprints.find(
        (blueprint: any) => blueprint.name == props.typeRef
      ),
    })
  )
  return mock
}
