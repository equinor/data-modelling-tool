export const downloadAction = (action: any) => {
  return {
    prompt: {
      title: 'Create Application',
      content: 'Download the application',
      buttonText: 'Download',
      ...(action.data.prompt || {}),
    },
    onSubmit: () => {
      window.open(action.data.url)
    },
  }
}
