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
  index: TreeNode[]
  loading: boolean
}>
// @ts-ignore
FSTreeContext = createContext({ tree: null, index: [], loading: false })

export const FSTreeProvider = (props: { children: ReactNode }) => {
  const { children } = props
  const [loading, setLoading] = useState<boolean>(true)
  const { token } = useContext(AuthContext)
  const appConfig = useContext(ApplicationContext)
  const [index, setIndex] = useState<TreeNode[]>([])
  const tree: Tree = new Tree(token, appConfig.visibleDataSources, (t: Tree) =>
    // @ts-ignore
    setIndex([...t])
  )

  useEffect(() => {
    setLoading(true)
    tree.init().finally(() => setLoading(false))
  }, [])

  return (
    <FSTreeContext.Provider value={{ tree, index, loading }}>
      {children}
    </FSTreeContext.Provider>
  )
}
