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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function myExternalSystemCall(input) {
  return {
    jobId: 'kk873ks',
    result: 123456,
    executionTime: '1233215.34234ms',
    progress: 100,
    status: 'done',
    message: 'job complete, no errors',
  }
}

async function simulateCrash({ input, output, updateDocument, createEntity }) {
  let entity = {
    ...output.entity,
    // This is an invalid attribute. Will not get written to database.
    hallo: 'Hey',
  }
  updateDocument({ ...output, entity })
  // Using the passed "createEntity" function, we can get an empty, in-memory entity, of any type.
  let newWheel = await createEntity('SSR-DataSource/CarPackage/Wheel')

  // If the browser is interrupted during this sleep, the rest of the function will NOT be executed.
  await sleep(10000)
  entity.description = 'a'
  updateDocument({ ...output, entity })
  updateDocument({ ...output, entity: myExternalSystemCall(input) })

  await sleep(2000)
  entity.description = 'b'
  updateDocument({ ...output, entity })

  await sleep(5000)
  entity.description = 'c'
  updateDocument({ ...output, entity })

  await sleep(5000)
  entity['wheels'] = [
    {
      name: 'test5',
      description: '',
      type: 'SSR-DataSource/CarPackage/Wheel',
      diameter: 120,
      pressure: 0,
      wheelsRecursive: [],
    },
  ]
  output.notify = true
  updateDocument({ ...output, entity })
}

async function runEngineResultFile({ input, output, updateDocument }) {
  output.entity.power = 'test'
  updateDocument(output)

  await sleep(2000)
  output.entity.description = 'Updated description from action1'
  updateDocument(output)
  await sleep(2000)
  output.entity.description = 'Updated description from action2'
  updateDocument(output)

  await sleep(2000)
  output.entity.description = 'Updated description from action3'
  updateDocument(output)
}

async function runEngineResultInEntity({ input, output, updateDocument }) {
  let entity = input.entity
  entity.power = '94bhp'
  entity.fuelPump = { name: 'My FuelPump', description: 'something' }
  updateDocument({ ...output, entity, notify: true })
}

const getTodoList = async ({
  input,
  output,
  updateDocument,
  createEntity,
  explorer,
}) => {
  explorer.toggle({ nodeId: input.id })
  await sleep(2000)
  explorer.toggle({ nodeId: input.id })
  await sleep(2000)
  explorer.toggle({ nodeId: input.id })

  let entity = {
    ...output.entity,
  }

  const type = output.blueprint.split('/')
  const blueprint = await explorer.index.services.documentApi.getByPath(
    type.shift(),
    type.join('/')
  )
  const todoItem = blueprint.document.attributes.find(
    attribute => attribute.name === 'items'
  )

  const nodeUrl = `/api/v4/index/${output.dataSource}/${output.id}`
  const content = {
    attribute: 'items',
    // @ts-ignore
    description: 'Some description',
    name: 'Item3',
    parentId: output.id,
    type: todoItem.attributeType,
  }
  // Explorer.create is basically the same as using add to parent,
  // since the URL add-to-parent is set on backend.
  const item1 = await explorer.addToParent({
    dataSourceId: output.dataSource,
    data: content,
    nodeUrl: nodeUrl,
  })
  entity.items.push({
    _id: item1.uid,
    type: todoItem.attributeType,
    name: content.name,
  })
  explorer.updateById({
    dataSourceId: output.dataSource,
    documentId: item1.uid,
    attribute: '',
    data: await createEntity(todoItem.attributeType),
    nodeUrl,
  })

  updateDocument({ ...output, entity, notify: true })
}

function cancelSimulation() {
  alert('Sending SIGTERM to ongoing job')
}

const runnableMethods = {
  getTodoList,
  simulateCrash,
  runEngineResultFile,
  runEngineResultInEntity,
  cancelSimulation,
}

export default runnableMethods
