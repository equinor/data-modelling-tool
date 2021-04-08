import IndexProvider, { useGlobalIndex } from './IndexProvider'
import { IIndexAPI, IndexNodes } from '../../services/api/interfaces/IndexAPI'
import { Application, NodeType } from '../../utils/variables'
import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import { mock } from 'jest-mock-extended'
import { DataSource } from '../../services/api/interfaces/DataSourceAPI'
import { IDocumentAPI } from '../../services/api/interfaces/DocumentAPI'

const wrapper: React.FC = ({
  children,
  indexApi,
  dataSources,
  application,
}: any) => (
  <IndexProvider
    indexApi={indexApi}
    dataSources={dataSources}
    application={application}
  >
    {children}
  </IndexProvider>
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

  const application = Application.BLUEPRINTS

  describe('when provider is initialized', () => {
    it('should correctly return the IndexContext object', async () => {
      const api = mock<IIndexAPI>()
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
