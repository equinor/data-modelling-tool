import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks'
import * as React from 'react'
import { IIndex, useIndex } from './useIndex'
import { mock } from 'jest-mock-extended'
import { IDmtAPI, IndexNodes } from '../services'
import { NodeType } from '../utils/variables'
import { AuthProvider } from '../../../../app/src/context/auth/AuthContext'
import { DataSource } from '../services/api/interfaces/DataSource'

const wrapper: React.FC = ({ children }: any) => (
  <AuthProvider authEnabled={false}>{children}</AuthProvider>
)

const getMocks = () => {
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

  const dmtAPI = mock<IDmtAPI>()
  const indexNodes: IndexNodes = {
    '1': {
      id: '1',
      title: 'Node 1',
      nodeType: NodeType.PACKAGE,
      type: NodeType.PACKAGE,
      parentId: '',
      children: [],
      meta: {
        indexUrl: '/api/v1/index/1',
      },
    },
    '2': {
      id: '2',
      title: 'Node 2',
      nodeType: NodeType.BLUEPRINT,
      type: NodeType.BLUEPRINT,
      parentId: '',
      children: [],
      meta: {},
    },
  }
  dmtAPI.getIndexByDataSource.mockReturnValue(Promise.resolve(indexNodes))

  const indexNodeToBeAdded: IndexNodes = {
    '3': {
      id: '3',
      title: 'Node 3',
      nodeType: NodeType.PACKAGE,
      type: NodeType.PACKAGE,
      parentId: '',
      children: [],
      meta: {
        indexUrl: '/api/v1/index/3',
      },
    },
  }
  dmtAPI.getIndexByDocument.mockReturnValue(Promise.resolve(indexNodeToBeAdded))

  const application = {
    name: 'testApp',
    visibleDataSources: ['source1', 'source2'],
  }

  return { dataSources, dmtAPI, application }
}

describe('the useIndex hook', () => {
  let mocks: any
  let response: RenderHookResult<any, IIndex>

  beforeEach(async () => {
    mocks = getMocks()
    await act(async () => {
      response = renderHook(() => useIndex(mocks), { wrapper })
    })
  })

  describe('when provider is initialized', () => {
    it('should correctly return models and operations', async () => {
      expect(response.result.current).toMatchObject({
        models: {
          tree: expect.any(Object),
        },
        operations: {
          add: expect.any(Function),
          remove: expect.any(Function),
          toggle: expect.any(Function),
        },
      })
    })

    it('should have fetched the index for all data sources', async () => {
      expect(mocks.dmtAPI.getIndexByDataSource).toHaveBeenCalledTimes(2)
      expect(mocks.dmtAPI.getIndexByDataSource).toHaveBeenCalledWith(
        'source1',
        mocks.application.name,
        null
      )
      expect(mocks.dmtAPI.getIndexByDataSource).toHaveBeenCalledWith(
        'source2',
        mocks.application.name,
        null
      )
    })
  })

  describe('when the add function is called', () => {
    it('should the added node be visible in the tree', async () => {
      await act(async () => {
        expect(
          response.result.current.models.tree.operations.getNode('3')
        ).toBeUndefined()

        await act(async () => {
          response.result.current.operations.add('3', '/api/v1/index/')
        })

        expect(
          response.result.current.models.tree.operations.getNode('3')
        ).toEqual({
          children: [],
          icon: 'folder',
          isExpandable: true,
          isFolder: true,
          isHidden: false,
          isLoading: false,
          isOpen: true,
          isRoot: false,
          meta: {
            indexUrl: '/api/v1/index/3',
            type: 'system/SIMOS/Package',
          },
          nodeId: '3',
          nodeType: 'system/SIMOS/Package',
          templateRef: '',
          title: 'Node 3',
        })
      })
    })
  })
})
