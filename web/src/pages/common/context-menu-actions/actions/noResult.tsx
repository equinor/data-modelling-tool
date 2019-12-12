import { Input, Method } from './actions'

export default (input: Input, method: Method, setShowModal: Function) => {
  return {
    prompt: {
      title: method.name,
      content: `Are you sure you want to run the function '${method.name}'?`,
      buttonText: 'Run',
    },
    onSubmit: () => {
      method({ input })
      setShowModal(false)
    },
  }
}
