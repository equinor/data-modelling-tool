import { DmssAPI } from '@dmt/common'

export const mockGetBlueprint = (blueprints: any) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'blueprintGet')
  mock.mockImplementation((props: any) =>
    Promise.resolve(
      blueprints.find((blueprint: any) => blueprint.name == props.typeRef)
    )
  )
  return mock
}
