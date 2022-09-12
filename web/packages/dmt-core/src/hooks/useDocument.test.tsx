import { useDocument } from './useDocument'
import { renderHook } from '@testing-library/react-hooks'
import { mockGetDocument } from '../utils/test-utils-dmt-core'

const searchHits = [
  {
    _id: '1',
    name: 'Analysis1',
    description: 'Description1',
  },
  {
    _id: '2',
    name: 'Analysis2',
    description: 'Description2',
  },
]
const topHits = [
  {
    _id: '3',
    name: 'Analysis3',
    description: 'Description3',
  },
  {
    _id: '4',
    name: 'Analysis4',
    description: 'Description4',
  },
]

describe('useDocument hook', () => {
  it('should correctly return the document', async () => {
    const mock = mockGetDocument([searchHits], false)
    const { result, waitForNextUpdate } = renderHook(() => useDocument('', ''))

    await waitForNextUpdate()
    expect(result.current[0]).toEqual([searchHits])
    expect(mock).toHaveBeenCalledTimes(1)
    expect(mock).toHaveBeenCalledWith({
      dataSourceId: '',
      documentId: '',
      depth: 1,
    })
  })
  it('return error message when getdocumentbyid fails', async () => {
    const mock = mockGetDocument([searchHits], true)
    const { result, waitForNextUpdate } = renderHook(() => useDocument('', ''))

    await waitForNextUpdate()
    expect(result.current[0]).toEqual(null)
    expect(result.current[1]).toEqual(false)
    expect(result.current[3]).toEqual('error')
    expect(mock).toHaveBeenCalledTimes(1)
  })
})
