const getTodoList = ({ input, output, updateDocument }) => {
  output.entity = { hallo: 'Hey' }
  alert('hallo!')
  updateDocument(output)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function run({ input, output, updateDocument }) {
  let entity = {
    ...output.entity,
    // This is an invalid attribute. Will not get written to database.
    hallo: 'Hey',
  }
  updateDocument({ ...output, entity })

  await sleep(10000)
  entity = { ...entity, diameter: 346 }
  updateDocument({ ...output, entity })
}

const runnableMethods = {
  getTodoList,
  run,
}

export default runnableMethods
