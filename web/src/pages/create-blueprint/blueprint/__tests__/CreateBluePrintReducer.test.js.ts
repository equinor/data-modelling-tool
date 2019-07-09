import reducer, { Actions, initialState } from '../CreateBluePrintReducer'

describe('CreateBluePrintReducer', () => {
  it('should not support any action', () => {
    const newState = reducer(
      //avoid altering initialState.
      Object.assign({}, initialState),
      { type: 'not supported', data: 'test' }
    )
    expect(newState).toBeUndefined()
  })

  it('should add new node', () => {
    const newState = reducer(
      //avoid altering initialState.
      Object.assign({}, initialState, {
        nodes: {
          '/existing': { some_prop: 42 },
        },
      }),
      Actions.addNodes({ path: '/geo', isRoot: false, type: 'file' })
    )
    expect(newState).toMatchObject({
      nodes: {
        '/existing': { some_prop: 42 },
        '/geo': { path: '/geo', isRoot: true, type: 'file' },
      },
    })
  })

  it('should fetch model', () => {
    const newState = reducer(
      //avoid altering initialState.
      Object.assign({}, initialState),
      Actions.fetchModel('/box', { box: 'box' })
    )
    expect(newState).toMatchObject({
      modelFiles: {
        '/box': {
          box: 'box',
        },
      },
    })
  })

  it('should update formData', () => {
    const newState = reducer(
      //avoid altering initialState.
      Object.assign({}, initialState),
      Actions.updateFormData('/box', { box: 'box' })
    )
    expect(newState).toMatchObject({
      formData: {
        '/box': {
          box: 'box',
        },
      },
    })
  })

  it('should set selected template', () => {
    const newState = reducer(
      //avoid altering initialState.
      Object.assign({}, initialState),
      Actions.setSelectedTemplatePath('/box')
    )
    expect(newState).toMatchObject({
      selectedTemplatePath: '/box',
    })
  })

  it('should filter nodes', () => {
    const newState = reducer(
      //avoid altering initialState.
      Object.assign({}, initialState, {
        nodes: {
          '/box': {
            path: '/box',
          },
          '/box2': {
            path: '/box2',
          },
        },
      }),
      Actions.filterTree('box2')
    )
    expect(newState).toMatchObject({
      nodes: {
        '/box': {
          isHidden: true,
        },
        '/box2': {},
      },
    })
  })
})
