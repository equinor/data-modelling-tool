import React from 'react'

import DashboardProvider, {
  IDashboard,
  DashboardConsumer,
} from '../context/dashboard/DashboardProvider'
import { ApplicationContext } from '@dmt/common'
import { act, renderHook, RenderHookResult } from '@testing-library/react-hooks'
import useExplorer, { IUseExplorer } from './useExplorer'
import { mock } from 'jest-mock-extended'
import {
  NodeType,
  DataSources,
  IDataSourceAPI,
  IIndexAPI,
  IndexNodes,
  IDocumentAPI,
} from '@dmt/common'
import IndexProvider from '../context/global-index/IndexProvider'
import { LayoutComponents } from '../context/dashboard/useLayout'

const wrapper: React.FC = ({
  children,
  application,
  dataSourceApi,
  indexApi,
}: any) => (
  <DashboardProvider dataSourceApi={dataSourceApi}>
    <DashboardConsumer>
      {(dashboard: IDashboard) => {
        return (
          <ApplicationContext.Provider value={application}>
            <IndexProvider
              dataSources={dashboard.models.dataSources.models.dataSources}
              indexApi={indexApi}
            >
              {children}
            </IndexProvider>
          </ApplicationContext.Provider>
        )
      }}
    </DashboardConsumer>
  </DashboardProvider>
)

const getMocks = () => {
  const dataSourceApi = mock<IDataSourceAPI>()
  const dataSources: DataSources = [
    {
      id: 'localhost',
      name: 'localhost',
    },
  ]
  dataSourceApi.getAll.mockImplementation(() => Promise.resolve(dataSources))

  const indexApi = mock<IIndexAPI>()
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
  indexApi.getIndexByDataSource.mockReturnValue(Promise.resolve(indexNodes))
  indexApi.getIndexByDocument.mockReturnValue(Promise.resolve(indexNodes))

  const documentApi = mock<IDocumentAPI>()

  class Item {
    id: string
    children: Item[]

    constructor(id: string) {
      this.id = id
      this.children = []
    }

    addChild(values: any): void {
      this.children.push(new Item(values['id']))
    }
  }

  class Root {
    contentItems: Item[]

    constructor() {
      this.contentItems = [new Item('0')]
    }

    getItemsById(id: string) {
      const item = this.contentItems[0].children.find((item: Item) => {
        return item.id === id
      })
      if (item == undefined) {
        return []
      } else {
        return [item]
      }
    }

    getItemsByFilter(filter: string) {
      return []
    }
  }

  const layoutMock = {
    myLayout: {
      root: new Root(),
    },
  }

  return { dataSourceApi, indexApi, layoutMock, documentApi }
}

describe('the explorer hook', () => {
  const application = { name: 'testApp', visibleDataSources: ['localhost'] }

  let mocks: any
  let response: RenderHookResult<any, IUseExplorer>

  beforeEach(async () => {
    mocks = getMocks()
    await act(async () => {
      response = renderHook(
        () =>
          useExplorer({
            documentAPI: mocks.documentApi,
          }),
        {
          wrapper,
          initialProps: { ...mocks, application },
        }
      )
      // We need to wait for the tree and other things to be ready.
      await response.waitFor(() => {
        expect(
          response.result.current.index.models.index.models.tree.operations.getNode(
            '1'
          )
        ).toBeDefined()
      })
      response.result.current.dashboard.models.layout.operations.registerLayout(
        mocks.layoutMock
      )
    })
  })

  describe('when hook is initialized', () => {
    it('should return by default', () => {
      expect(response.result.current).toMatchObject({
        toggle: expect.any(Function),
        open: expect.any(Function),
        create: expect.any(Function),
        remove: expect.any(Function),
        rename: expect.any(Function),
        updateById: expect.any(Function),
      })
    })
    it('should contain two documents in the tree', () => {
      expect(
        response.result.current.index.models.index.models.tree.operations.getNode(
          '1'
        )
      ).toBeDefined()
      expect(
        response.result.current.index.models.index.models.tree.operations.getNode(
          '2'
        )
      ).toBeDefined()
    })
  })

  describe('when toggle is called', () => {
    describe('on a document that exists', () => {
      describe('and document is expandable', () => {
        beforeEach(async () => {
          expect(
            response.result.current.index.models.index.models.tree.operations.getNode(
              '1'
            ).isExpandable
          ).toEqual(true)
          expect(
            response.result.current.index.models.index.models.tree.operations.getNode(
              '1'
            ).isOpen
          ).toEqual(false)
          await act(async () => {
            response.result.current.toggle({ nodeId: '1' })
          })
        })
        it('should maximize document in tree', async () => {
          expect(
            response.result.current.index.models.index.models.tree.operations.getNode(
              '1'
            ).isOpen
          ).toEqual(true)
        })
        it('should add (fetch children)', async () => {
          expect(mocks.indexApi.getIndexByDocument).toHaveBeenCalledTimes(1)
          expect(mocks.indexApi.getIndexByDocument).toHaveBeenCalledWith(
            '/api/v1/index/1',
            '1',
            application.name
          )
        })
      })

      describe('and document is not expandable', () => {
        beforeEach(async () => {
          expect(
            response.result.current.index.models.index.models.tree.operations.getNode(
              '2'
            ).isExpandable
          ).toEqual(false)
          expect(
            response.result.current.index.models.index.models.tree.operations.getNode(
              '2'
            ).isOpen
          ).toEqual(false)
          await act(async () => {
            response.result.current.toggle({ nodeId: '2' })
          })
        })
        it('should maximize document in tree', async () => {
          expect(
            response.result.current.index.models.index.models.tree.operations.getNode(
              '2'
            ).isOpen
          ).toEqual(true)
        })
        it('should not add (fetch children)', async () => {
          expect(mocks.indexApi.getIndexByDocument).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('on a document that does not exist', () => {
      const nodeId: string = '999'
      beforeEach(async () => {
        await act(async () => {
          response.result.current.toggle({ nodeId: nodeId })
        })
      })
      it('toggle() should set an errorMessage in useExplorer', async () => {
        expect(response.result.current.errorMessage).toBe(
          `Could not toggle this document (Node not found: ${nodeId})`
        )
      })
    })
  })

  describe('when open is called', () => {
    it('should open and show in the layout the selected document', async () => {
      expect(
        response.result.current.dashboard.models.layout.operations.isOpen('1')
      ).toEqual(false)
      response.result.current.open({
        nodeId: '1',
        dataSourceId: '',
        fetchUrl: {
          uid: '1',
          title: '1',
          component: LayoutComponents.blueprint,
          // @ts-ignore
          data: '/url',
        },
      })
      expect(
        response.result.current.dashboard.models.layout.operations.isOpen('1')
      ).toEqual(true)
    })
  })

  describe('when create is called', () => {
    describe('on a document that exists', () => {
      let documentToCreate = {
        data: {
          name: 'Document name',
          type: NodeType.BLUEPRINT,
        },
        dataUrl: 'url/data',
        nodeUrl: 'url/node',
      }
      beforeEach(async () => {
        const createdDocument = {
          uid: '1000',
        }
        mocks.documentApi.create.mockReturnValue(
          Promise.resolve(createdDocument)
        )

        const indexNodes = {
          '1000': {
            id: '1000',
            title: 'Node 1000',
            nodeType: NodeType.BLUEPRINT,
            type: NodeType.BLUEPRINT,
            parentId: '',
            children: [],
            meta: {},
          },
        }
        mocks.indexApi.getIndexByDocument.mockReturnValue(
          Promise.resolve(indexNodes)
        )
        await act(async () => {
          response.result.current.create(documentToCreate)
        })
      })
      it('should the document be saved to the server', async () => {
        expect(mocks.documentApi.create).toHaveBeenCalledTimes(1)
        expect(mocks.documentApi.create).toHaveBeenCalledWith(
          documentToCreate.dataUrl,
          documentToCreate.data
        )
      })
      it('should the document be added to the tree', async () => {
        expect(
          response.result.current.index.models.index.models.tree.operations.getNode(
            '1000'
          )
        ).toEqual({
          children: [],
          icon: 'blueprint',
          isExpandable: false,
          isFolder: true,
          isHidden: false,
          isLoading: false,
          isOpen: true,
          isRoot: false,
          meta: {
            type: 'system/SIMOS/Blueprint',
          },
          nodeId: '1000',
          nodeType: 'system/SIMOS/Blueprint',
          templateRef: '',
          title: 'Node 1000',
        })
      })
    })

    describe('creating a document', () => {
      let documentWithoutName = {
        data: {
          name: '',
          type: NodeType.BLUEPRINT,
        },
        dataUrl: 'url/data',
        nodeUrl: 'url/node',
      }
      let documentWithoutType = {
        data: {
          name: 'Example name',
          type: undefined,
        },
        dataUrl: 'url/data',
        nodeUrl: 'url/node',
      }
      let documentWithWrongDataUrl = {
        data: {
          name: 'Document name',
          type: NodeType.BLUEPRINT,
        },
        dataUrl: '??????',
        nodeUrl: '??????',
      }
      beforeEach(async () => {
        const createdDocument = {
          uid: '1000',
        }
        mocks.documentApi.create.mockReturnValue(
          Promise.resolve(createdDocument)
        )

        const indexNodes = {
          '1000': {
            id: '1000',
            title: 'Node 1000',
            nodeType: NodeType.BLUEPRINT,
            type: NodeType.BLUEPRINT,
            parentId: '',
            children: [],
            meta: {},
          },
        }
        mocks.indexApi.getIndexByDocument.mockReturnValue(
          Promise.resolve(indexNodes)
        )
      })
      it('with wrong name should create an errorMessage', async () => {
        await act(async () => {
          response.result.current.create(documentWithoutName)
        })
        expect(response.result.current.errorMessage).toBe('Name is required')
      })
      it('with undefined type should create an errorMessage', async () => {
        await act(async () => {
          response.result.current.create(documentWithoutType)
        })
        expect(response.result.current.errorMessage).toBe('Type is required')
      })
      // todo: make wrong dataURL return error
      /*
      it('with wrong dataURL should create an errorMessage', async () => {
        await act(async () => {
          response.result.current.create(documentWithWrongDataUrl)
        })
        expect(
          response.result.current.errorMessage
        ).toBe('????') //todo - does not catch error here....
      })
      */
    })
  })

  describe('when remove is called', () => {
    describe('and documentApi returns a resolved promise', () => {
      beforeEach(async () => {
        await act(async () => {
          mocks.documentApi.remove.mockImplementation(() => Promise.resolve())
          response.result.current.remove({
            nodeId: '2',
            parent: '',
            url: '/',
            data: {},
          })
        })
      })
      it('should the document be removed from the server ', async () => {
        expect(mocks.documentApi.remove).toHaveBeenCalledTimes(1)
      })
      it('should the document be removed from the tree', async () => {
        expect(
          response.result.current.index.models.index.models.tree.operations.getNode(
            '2'
          )
        ).toBeUndefined()
      })
    })

    describe('and document api returns a rejected promise', () => {
      beforeEach(async () => {
        await act(async () => {
          mocks.documentApi.remove.mockImplementation(() =>
            Promise.reject(new Error('error'))
          )
          response.result.current.remove({
            nodeId: '9999',
            parent: '',
            url: '????',
            data: { valueA: 'A' },
          })
        })
      })
      it('should create an errorMessage', () => {
        expect(response.result.current.errorMessage).toBe(
          'Could not remove document. Received error: Error: error'
        )
      })
    })
  })

  describe('when rename is called', () => {
    describe('and documentApi returns a resolved promise', () => {
      beforeEach(async () => {
        const updatedDocument = {
          uid: '1',
        }
        mocks.documentApi.explorerRename.mockReturnValue(
          Promise.resolve(updatedDocument)
        )

        const indexNodes = {
          '1': {
            id: '1',
            title: 'New name',
            nodeType: NodeType.PACKAGE,
            type: NodeType.PACKAGE,
            parentId: '',
            children: [],
            meta: {},
          },
        }

        mocks.indexApi.getIndexByDocument.mockReturnValue(
          Promise.resolve(indexNodes)
        )
        await act(async () => {
          response.result.current.rename({
            dataSourceId: 'localhost',
            documentId: '1',
            nodeUrl: '/',
            renameData: { name: 'New name', parentId: null },
          })
        })
      })

      it('should the document be updated to the server', async () => {
        expect(mocks.documentApi.explorerRename).toHaveBeenCalledTimes(1)
      })
      it('should the document be updated in the tree', async () => {
        expect(mocks.indexApi.getIndexByDocument).toHaveBeenCalledTimes(1)
        expect(
          response.result.current.index.models.index.models.tree.operations.getNode(
            '1'
          )
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
            type: 'system/SIMOS/Package',
          },
          nodeId: '1',
          nodeType: 'system/SIMOS/Package',
          templateRef: '',
          title: 'New name',
        })
      })
    })

    describe('on a documentApi returns a rejected promise', () => {
      beforeEach(async () => {
        mocks.documentApi.explorerRename.mockReturnValue(
          Promise.reject(new Error('error'))
        )

        await act(async () => {
          response.result.current.rename({
            dataSourceId: 'localhost',
            documentId: '1',
            nodeUrl: '/',
            renameData: { name: 'New name', parentId: null },
          })
        })
      })
      it('should create an errorMessage', () => {
        expect(response.result.current.errorMessage).toBe(
          'Could not rename selected document. (Error: error)'
        )
      })
    })
  })
})
