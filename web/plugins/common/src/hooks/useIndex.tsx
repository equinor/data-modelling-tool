import { useContext, useEffect, useState } from 'react'
import { Tree, TreeNodeData } from '../components/Tree'
import { IIndexAPI, IndexNode, IndexNodes } from '../services'
import { ITree, useTree } from '../components/Tree'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
// @ts-ignore
import values from 'lodash/values'
import { DataSource } from '../services'
import IndexAPI from '../services/api/IndexAPI'
import { toObject, toTreeNodes } from './utils/useIndexUtils'
import { ApplicationContext } from '../context/ApplicationContext'
import useLocalStorage from "../../../dmt-app/src/hooks/useLocalStorage";

export interface IModels {
  tree: ITree
}

export interface IOperations {
  add(documentId: string, nodeUrl: string, visible?: boolean): Promise<void>

  remove(nodeId: string, parent: string): Promise<void>

  toggle(nodeId: string): Promise<void>
}

export interface IIndex {
  models: IModels
  operations: IOperations
}

export interface IndexProps {
  dataSources: DataSource[]
  application: any
  indexApi?: IIndexAPI
}

export const useIndex = (props: IndexProps): IIndex => {
  const { dataSources, application, indexApi = new IndexAPI() } = props
  const [dataSourceWarning, setDataSourceWarning] = useState<string>('')
  const [index, setIndex] = useState<Tree>({})
  const [token, setToken] = useLocalStorage("token", null)

  useEffect(() => {
    if (dataSourceWarning) {
      const timer = setTimeout(() => {
        setDataSourceWarning('')
      }, 15000)
      NotificationManager.warning(`${dataSourceWarning}`)
    }
  }, [dataSourceWarning])

  const populateIndex = async (): Promise<void> => {
    let indexes: IndexNodes[] = []
    if (
      !application.visibleDataSources ||
      application.visibleDataSources.length === 0
    ) {
      setDataSourceWarning(
        `Application ${application.name} has no visible data sources defined in settings.json.`
      )
    }
    await Promise.all(
      dataSources.map((dataSource: DataSource) => {
        if (
          (application?.visibleDataSources &&
            application?.visibleDataSources.includes(dataSource.name)) ||
          application?.displayAllDataSources ||
          application.visibleDataSources === undefined
        ) {
          return indexApi
            .getIndexByDataSource(dataSource.id, application.name, token)
            .then((res) => {
              indexes.push(res)
            })
            .catch((error) => {
              console.error(error)
              NotificationManager.error(`${error.response.data.message}`)
            })
        }
      })
    )
    const combinedIndex = indexes
      .map((indexNode: IndexNodes) => toTreeNodes(indexNode))
      .map((treeNode) => treeNode.reduce(toObject, {}))
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
  }, [dataSources, application])

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
        application.name,
        token
      )

      const treeNodes: TreeNodeData[] = toTreeNodes(result)
        .map((node) => {
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

  const remove = async (nodeId: string, parent: string) => {
    return tree.operations.removeNode(nodeId, parent)
  }

  const toggle = async (nodeId: string) => {
    const node: TreeNodeData = tree.operations.getNode(nodeId)
    if (!node) {
      throw `Node not found: ${nodeId}`
    }
    tree.operations.toggle(nodeId)
    if (node.meta.indexUrl && node.isExpandable && !node.isOpen) {
      return add(nodeId, node.meta.indexUrl)
    }
  }

  return {
    models: {
      tree,
    },
    operations: {
      add,
      remove,
      toggle,
    },
  }
}
