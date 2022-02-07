export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString(navigator.language)
}
