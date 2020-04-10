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
// This action will be available on any entity of the type "SSR-DataSource/CarPackage/Car"(input).
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
// * The API uses an "update" strategy when writing the output entity. This means that it merges the existing document with the provided output entity.
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

async function run({ input, output, updateDocument, createEntity }) {
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
  // updateDocument({ ...output, entity: myExternalSystemCall(input) })

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

async function runResultFile({ input, output, updateDocument }) {
  let entity = { diameter: 1 }
  updateDocument({ ...output, entity })

  await sleep(5000)
  entity = { diameter: 999999999999 }
  updateDocument({ ...output, entity })
}

async function runNoResult({ input, output, updateDocument }) {
  await sleep(5000)
  alert('hallo')
}

async function runResultInEntity({ input, output, updateDocument }) {
  let entity = input.entity
  entity.diameter = 1
  entity.status.progress = 50.12
  updateDocument({ ...output, entity })

  await sleep(5000)
  entity.diameter = 999999999999
  entity.status = { ...entity.status, progress: 100, message: 'Done!' }
  updateDocument({ ...output, entity, notify: true })
}

const runnableMethods = {
  run,
  runResultFile,
  runNoResult,
  runResultInEntity,
}

export default runnableMethods
