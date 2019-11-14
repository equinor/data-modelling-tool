
const getTodoList = ({ document, config, setProgress, updateDocument }) => {
  document.description = 'Test: ' + Math.random()
  updateDocument(document)
}

const getCar = (props) => {
  const { document, config, setProgress, updateDocument } = props
  document.description = 'Test: ' + Math.random()
  console.log(props)
  updateDocument(document)
}

const runnableMethods = {
  getTodoList,
  getCar,
}

export default runnableMethods
