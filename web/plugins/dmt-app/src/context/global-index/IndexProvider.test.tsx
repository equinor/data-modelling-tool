import IndexProvider, { useGlobalIndex } from './IndexProvider'
import React from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { mock } from 'jest-mock-extended'
import {
  DataSource,
  IDocumentAPI,
  ApplicationContext,
  IIndexAPI,
} from '@dmt/common'

const wrapper: React.FC = ({
  children,
  indexApi,
  dataSources,
  application,
}: any) => (
  <ApplicationContext.Provider value={application}>
    <IndexProvider indexApi={indexApi} dataSources={dataSources}>
      {children}
    </IndexProvider>
  </ApplicationContext.Provider>
)

describe('the index provider component', () => {
  const dataSources: DataSource[] = [
    {
      id: 'source1',
      name: 'source1',
    },
    {
      id: 'source2',
      name: 'source2',
    },
  ]

  const application = {
    name: 'testApp',
    visibleDataSources: ['source1', 'source2'],
  }

  describe('when provider is initialized', () => {
    it('should correctly return the IndexContext object', async () => {
      const api = mock<IIndexAPI>()
      api.getIndexByDataSource.mockReturnValue(Promise.resolve({}))
      const documentApi: IDocumentAPI = mock<IDocumentAPI>()

      const { result, waitForNextUpdate } = renderHook(useGlobalIndex, {
        wrapper,
        initialProps: {
          indexApi: api,
          documentApi,
          application,
          dataSources,
        },
      })
      await waitForNextUpdate()
      expect(result.current).toMatchObject({
        models: {
          index: expect.any(Object),
        },
      })
    })
  })
})
