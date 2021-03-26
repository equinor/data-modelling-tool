import IndexProvider, { useIndex } from './IndexProvider'
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
  documentApi,
  dataSources,
  application,
}: any) => (
  <IndexProvider
    indexApi={indexApi}
    documentApi={documentApi}
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

      const { result, waitForNextUpdate } = renderHook(useIndex, {
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
          tree: expect.any(Object),
        },
        operations: {
          add: expect.any(Function),
          create: expect.any(Function),
          remove: expect.any(Function),
          update: expect.any(Function),
        },
      })
    })

    it('should have fetched the index for all data sources', async () => {
      const api = mock<IIndexAPI>()
      const documentApi: IDocumentAPI = mock<IDocumentAPI>()
      await act(async () => {
        renderHook(useIndex, {
          wrapper,
          initialProps: {
            indexApi: api,
            documentApi,
            application,
            dataSources,
          },
        })
      })

      expect(api.getIndexByDataSource).toHaveBeenCalledTimes(2)
      expect(api.getIndexByDataSource).toHaveBeenCalledWith(
        'source1',
        application
      )
      expect(api.getIndexByDataSource).toHaveBeenCalledWith(
        'source2',
        application
      )
    })
  })

  describe('when the add function is called on the tree model', () => {
    const mockIndexAPI = mock<IIndexAPI>()
    const indexNodes: IndexNodes = {
      '1': {
        id: '1',
        title: 'Node 1',
        nodeType: NodeType.PACKAGE,
        type: 'Type',
        parentId: '',
      },
    }
    mockIndexAPI.getIndexByDocument.mockReturnValue(Promise.resolve(indexNodes))

    it('should the added node be visible in the tree', async () => {
      await act(async () => {
        const { result, waitForNextUpdate } = renderHook(useIndex, {
          wrapper,
          initialProps: {
            indexApi: mockIndexAPI,
            application,
            dataSources,
          },
        })
        await waitForNextUpdate()

        expect(result.current.models.tree.models.tree).toEqual({})

        act(() => {
          result.current.operations.add('1', '/api/v1/index/')
        })

        await waitForNextUpdate()

        expect(result.current.models.tree.models.tree).toEqual({
          '1': {
            children: [],
            icon: 'file',
            isExpandable: false,
            isFolder: true,
            isHidden: false,
            isLoading: false,
            isOpen: true,
            isRoot: false,
            meta: {
              type: 'Type',
            },
            nodeId: '1',
            nodeType: 'system/SIMOS/Package',
            templateRef: '',
            title: 'Node 1',
          },
        })
      })
    })
  })
})
