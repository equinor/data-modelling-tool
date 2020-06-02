import { Output, Input, Method } from './actions'
import { useContext } from 'react'
import { StatusContext } from '../../StatusContext'

export default (
  input: Input,
  method: Method,
  setShowModal: Function,
  updateDocument: Function,
  createEntity: Function,
  dataSource: string
) => {
  const [status, setStatus] = useContext(StatusContext)
  const output: Output = {
    blueprint: input.blueprint,
    entity: input.entity,
    dataSource: dataSource,
    id: input.id,
  }
  return {
    prompt: {
      title: method.name,
      content: `Are you sure you want to run the function '${method.name}'?`,
      buttonText: 'Run',
    },
    onSubmit: () => {
      // @ts-ignore
      setStatus(status => ({ ...status, [output.id]: output.entity.status }))
      method({ input, output, updateDocument, createEntity })
      setShowModal(false)
    },
  }
}
