import React, { createContext, useContext } from 'react'

// @ts-ignore
export const TabsContext = createContext<any>()

export const useTabContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('useTabContext must be used within a RegistryProvider')
  }
  return context
}

export const TabsProvider = (props: any) => {
  const { onOpen, children } = props

  const value = {
    onOpen,
  }

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}
