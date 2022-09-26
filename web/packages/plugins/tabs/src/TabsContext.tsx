import React, { createContext, useContext } from 'react'
import { TChildTab } from '@development-framework/dm-core'

type TabsProviderProps = {
  onOpen: (tabData: TChildTab) => void
  children: React.ReactNode
}

export const TabsContext = createContext<any>({})

export const useTabContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('useTabContext must be used within a RegistryProvider')
  }
  return context
}

export const TabsProvider = (props: TabsProviderProps) => {
  const { onOpen, children } = props

  const value = {
    onOpen,
  }

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}
