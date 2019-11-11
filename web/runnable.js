const getMeasurements = ({ document, config, setProgress }) => {
  document.name = 'New name'
  return document
}

const getTodoList = ({ document, config, setProgress }) => {
  document.name = 'New name'
  return document
}

const runnableMethods = {
  getTodoList,
  getMeasurements,
}

export default runnableMethods
