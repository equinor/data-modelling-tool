
const getTodoList = ({ document, config, setProgress }) => {
  document.description = 'Test: ' + Math.random()
  return document
}

const getCar = (props) => {
  const { document, config, setProgress } = props
  document.description = 'Test: ' + Math.random()
  console.log(props)
  return document
}

const runnableMethods = {
  getTodoList,
  getCar,
}

export default runnableMethods
