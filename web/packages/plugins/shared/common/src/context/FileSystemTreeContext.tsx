import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react'
import { ApplicationContext, AuthContext, Tree, TreeNode } from '../index'

export let FSTreeContext: React.Context<{
  tree: Tree | null
  treeNodes: TreeNode[]
  loading: boolean
}>
// @ts-ignore
FSTreeContext = createContext({ tree: null, treeNodes: [], loading: false })

export const FSTreeProvider = (props: { children: ReactNode }) => {
  const { children } = props
  const { token } = useContext(AuthContext)
  const appConfig = useContext(ApplicationContext)
  const [loading, setLoading] = useState<boolean>(true)
  const [treeNodes, setTreeNodes] = useState<TreeNode[]>([])

  const tree: Tree = new Tree(
    token,
    // @ts-ignore
    (t: Tree) => setTreeNodes([...t])
  )

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
