import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { AuthContext } from 'react-oauth2-code-pkce'
import { ApplicationContext } from './ApplicationContext'
import { Tree, TreeNode } from '../domain/Tree'

export const FSTreeContext = createContext<{
  tree: null | Tree
  treeNodes: TreeNode[]
  loading: boolean
}>({
  tree: null,
  treeNodes: [],
  loading: false,
})

export const FSTreeProvider = (props: { children: ReactNode }) => {
  const { children } = props
  const { token } = useContext(AuthContext)
  const appConfig = useContext(ApplicationContext)
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])
  //@ts-ignore
  const tree: Tree = new Tree(token, (t: Tree) => setTreeNodes([...t]))

  useEffect(() => {
    setLoading(true)
    tree
      .initFromDataSources(appConfig.visibleDataSources)
      .finally(() => setLoading(false))
  }, [])

  return (
    <FSTreeContext.Provider value={{ tree, treeNodes, loading }}>
      {children}
    </FSTreeContext.Provider>
  )
}
