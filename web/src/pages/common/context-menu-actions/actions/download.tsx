export const downloadAction = (action: any) => {
  return {
    prompt: {
      title: 'Create Application',
      content: 'Download the application',
      buttonText: 'Download',
    },
    onSubmit: () => {
      window.open(action.data.url)
    },
  }
}
