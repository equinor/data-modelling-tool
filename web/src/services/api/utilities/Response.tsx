export function handleResponse(response: any) {
  if (response.results) {
    return response.results
  }

  if (response.data) {
    return response.data
  }

  return response
}

export function handleError(error: any) {
  if (error.data) {
    return error.data
  }
  return error
}
