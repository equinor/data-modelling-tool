export const downloadAction = (action: any) => {
  return {
    prompt: action.data.prompt,
    onSubmit: () => {
      window.open(action.data.url)
    },
  }
}
