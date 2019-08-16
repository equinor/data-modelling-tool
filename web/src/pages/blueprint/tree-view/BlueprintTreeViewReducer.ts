//@ts-ignore
import { NotificationManager } from 'react-notifications'
import TreeReducer, {
  Actions as CommonTreeActions,
  TreeActions,
} from '../../../components/tree-view/TreeReducer'
import { generateTreeViewNodes } from '../../../util/generateTreeView'
export const TOGGLE_NODE = 'TOGGLE_NODE'
export const FILTER_TREE = 'FILTER_TREE'
const ADD_ROOT_PACKAGE = 'ADD_ROOT_PACKAGE'
const ADD_PACKAGE = 'ADD_PACKAGE'
const ADD_FILE = 'ADD_FILE'
const ADD_ASSET = 'ADD_ASSET'

export interface BlueprintTreeViewActionsTypes extends TreeActions {
  addRootPackage: (path: string) => any
  addPackage: (path: string, title: string) => any
  addFile: (path: string, title: string) => any
  addAssets: (path: string, title: string) => any
}

export const BlueprintTreeViewActions: BlueprintTreeViewActionsTypes = {
  ...CommonTreeActions,
  addRootPackage: (path: string) => ({
    type: ADD_ROOT_PACKAGE,
    path,
  }),
  addPackage: (path: string, title: string) => ({
    type: ADD_PACKAGE,
    indexNode: {
      _id: path,
      title,
      isOpen: true,
    },
  }),
  addFile: (path: string, title: string) => ({
    type: ADD_FILE,
    indexNode: {
      _id: path,
      title,
      isOpen: true,
    },
  }),
  addAssets: (data: any, endpoint: string) => ({
    type: ADD_ASSET,
    data,
    endpoint,
  }),
}

export default (state: any, action: any) => {
  switch (action.type) {
    case ADD_ROOT_PACKAGE:
      const version = action.path.split('/')[1]
      const rootTitle = action.path.split('/')[0]
      //emulate reponse from api.
      const index = [
        {
          _id: `${rootTitle}/package.json`,
          title: rootTitle,
          isOpen: true,
        },
        {
          _id: action.path,
          title: rootTitle,
          version,
          isOpen: true,
        },
      ]
      // only add root-package if it does not exist.
      const newItems = index.filter(node => {
        return !isDuplicate(state, node._id)
      })
      console.log(index, newItems)
      if (newItems.length) {
        NotificationManager.success(index[1]._id, 'New package created')
        return generateTreeViewNodes(newItems, { ...state })
      } else {
        NotificationManager.error(
          `${rootTitle}/package.json exists.`,
          'Duplicate package'
        )
        return state
      }

    case ADD_PACKAGE:
    case ADD_FILE:
      if (isDuplicate(state, action.indexNode)) {
        NotificationManager.error(
          `${action.indexNode._id} exists.`,
          'Duplicate file'
        )
        return state
      } else {
        NotificationManager.success(
          `${action.indexNode._id}`,
          'New file created'
        )
        try {
          return generateTreeViewNodes([action.indexNode], { ...state })
        } catch (e) {
          NotificationManager.error(
            'Check index list',
            'Failed to generate treeview'
          )
          return state
        }
      }

    case ADD_ASSET:
      try {
        const nodes = generateTreeViewNodes(action.data)
        return { ...state, ...nodes }
      } catch (e) {
        NotificationManager.error(
          'Check index list',
          'Failed to generate treeview'
        )
        return state
      }

    case FILTER_TREE:
    case TOGGLE_NODE:
      return TreeReducer(state, action)

    default:
      console.error('not supported: ', action.type)
  }
}

type IndexNode = {
  _id: string
  title: string
  isOpen?: boolean
  version?: string
}

function isDuplicate(state: any, id: string): boolean {
  return !!(state as any)[id]
}

// function notify(_id: string) {
//   alert(`${_id} is not unique. Please edit the existing one or create new.`)
// }
