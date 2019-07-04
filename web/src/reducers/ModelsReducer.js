const FETCH_MODEL = 'FETCH_MODEL'

export const Actions = {
  fetchModel: (path, data) => ({
    type: FETCH_MODEL,
    path,
    data,
  }),
}

export default (state, action) => {
  switch (action.type) {
    case FETCH_MODEL:
      // GET request for remote image
      if (state[action.path]) {
        return state
      }
      return { ...state, ...{ [action.path]: action.data } }
    default:
      return state
  }
}
