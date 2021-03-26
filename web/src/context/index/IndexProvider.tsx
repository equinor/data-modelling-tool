import React, { createContext, useEffect, useState, useContext } from 'react'
import { ITree, useTree } from '../../components/tree-view/useTree'
import Api2 from '../../api/Api2'
import values from 'lodash/values'
import { toTreeNodes, toObject } from './IndexProviderUtils'
import Tree, { TreeNodeData } from '../../components/tree-view/Tree'
import {
  IIndexAPI,
  IndexNode,
  IndexNodes,
} from '../../services/api/interfaces/IndexAPI'
import { DataSource } from '../../services/api/interfaces/DataSourceAPI'
import { IDocumentAPI } from '../../services/api/interfaces/DocumentAPI'

export interface IModels {
  tree: ITree
}

export interface IOperations {
  add(documentId: string, nodeUrl: string, visible?: boolean): Promise<void>

  create(data: any, dataUrl: string, nodeUrl: string): Promise<void>

  remove(nodeId: string, parent: string, url: string, data: any): Promise<void>

  update(data: any, updateUrl: string): Promise<void>
}

export interface IIndex {
  models: IModels
  operations: IOperations
}

const IndexContext = createContext<IIndex>(null!)

export const useIndex = () => {
  const context = useContext(IndexContext)
  if (!context) {
    throw new Error('useIndex must be used within a IndexProvider')
  }
  return context
}

interface IndexProviderProps {
  dataSources: DataSource[]
  indexApi: IIndexAPI
  documentApi: IDocumentAPI
  application: string
  children?: any
}

const IndexProvider = ({
  indexApi,
  documentApi,
  dataSources,
  application,
  children,
}: IndexProviderProps) => {
  const [index, setIndex] = useState<Tree>({})

  const populateIndex = async (): Promise<void> => {
    const indexes: IndexNodes[] = await Promise.all(
      dataSources.map(dataSource =>
        indexApi.getIndexByDataSource(dataSource.id, application)
      )
    )
    const combinedIndex = indexes
      .map((indexNode: IndexNodes) => toTreeNodes(indexNode))
      .map(treeNode => treeNode.reduce(toObject, {}))
      .reduce((obj, item) => {
        return {
          ...obj,
          ...item,
        }
      }, {})
    setIndex(combinedIndex)
  }

  useEffect(() => {
    populateIndex()
  }, [dataSources])

  const tree: ITree = useTree(index)

  const add = async (
    documentId: string,
    nodeUrl: string,
    visible: boolean = false
  ) => {
    try {
      tree.operations.setIsLoading(documentId, true)
      const result = await indexApi.getIndexByDocument(
        nodeUrl,
        documentId,
        application
      )

      const treeNodes: TreeNodeData[] = toTreeNodes(result)
        .map(node => {
          // Open the specified node by default (or by demand).
          if (node.nodeId === documentId || visible) {
            node.isOpen = true
          }
          return node
        })
        .reduce(toObject, {})

      const indexNodes: IndexNode[] = values(result)
      const parentId = indexNodes[0]['parentId']
      const nodeId = indexNodes[0]['id']

      tree.operations.replaceNodes(nodeId, parentId, treeNodes)
      tree.operations.setIsLoading(documentId, false)
    } catch (error) {
      console.error(error)
    }
  }

  const create = async (data: any, dataUrl: string, nodeUrl: string) => {
    return documentApi.create(dataUrl, data)
  }

  const remove = async (
    nodeId: string,
    parent: string,
    url: string,
    data: any
  ) => {
    const result = await documentApi.remove(url, data)
    tree.operations.removeNode(nodeId, parent)
    return result
  }

  const update = async (data: any, updateUrl: string) => {
    return documentApi.update(updateUrl, data)
  }

  const value: IIndex = {
    models: {
      tree,
    },
    operations: {
      add,
      create,
      remove,
      update,
    },
  }

  return <IndexContext.Provider value={value}>{children}</IndexContext.Provider>
}

export default IndexProvider
