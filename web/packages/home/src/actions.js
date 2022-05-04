// This file is tightly coupled with the settings.json file, which contain your application settings.
// The settings file has 'actions', they look like this;
//     {
//       "name": "Calculate",
//       "description": "Simulate 80kmh concrete crash. Fiat panda 2011.",
//       "input": "SSR-DataSource/CarPackage/Car",
//       "output": "SSR-DataSource/CarPackage/Result",
//       "method": "run"
//     },
//
// This action will be available (right click) on any entity of the type "SSR-DataSource/CarPackage/Car"(input).
// The name given in "method" must be the name of a function in this file, as well as being in the "runnableMethods" object at the end of this file.
// The main use case for this custom function is to call SIMOS calculations, and update result objects.
// The properties that are passed to the function looks like this;
//       type Input = {
//         blueprint: string
//         entity: any
//         path: string
//         id: string
//       }
//
//       type Output = {
//         blueprint: string
//         entity: any
//         path: string
//         dataSource: string
//         id: string
//       }
//
//       updateDocument(output: Output): Function
//
// Current limitations and caveats;
// * updateDocument is a callBack. That means that if the web-browser get's interrupted(refresh,closed, etc.) the callBack is lost.
// * The API uses a strict type system, so if the output entity does NOT match the output blueprint, that attribute will not be updated.
// * The output object must be left intact, and posted on every updateDocument call. Everything besides the output.entity object should be considered "read-only".
// Here are a few examples;

async function simulateCat3StormResultInEntity({
  input,
  output,
  updateDocument,
  createEntity,
  explorer,
}) {
  output.entity.diameter = 222
  await updateDocument(output)
  let newEntity = await createEntity(output.entity.type)
  console.log(newEntity)
  let blueprint = await explorer.blueprintGet(newEntity.type)
  console.log(blueprint)
}

async function simulateCat3StormResultInNewFile({
  input,
  output,
  updateDocument,
  createEntity,
  explorer,
}) {
  output.entity.result = 333
  updateDocument(output)
}

function cancelSimulation() {
  alert('Sending SIGTERM to ongoing job')
}

const runnableMethods = {
  simulateCat3StormResultInEntity,
  simulateCat3StormResultInNewFile,
  cancelSimulation,
}

export default runnableMethods
