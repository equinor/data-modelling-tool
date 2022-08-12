import React, { createContext, useContext } from 'react'
import defaultWidgets from './widgets/index'

export const RegistryContext = createContext<any>({
  fields: {},
  widgets: {},
})

export const useRegistryContext = () => {
  const context = useContext(RegistryContext)
  if (!context) {
    throw new Error('useRegistryContext must be used within a RegistryProvider')
  }
  return context
}

export const RegistryProvider = (props: any) => {
  const { widgets, children, dataSourceId, documentId, onOpen } = props

  const allWidgets = { ...widgets, ...defaultWidgets }

  const getWidget = (namePath: string, widgetName: string) => {
    const name = widgetName.trim()
    if (name in allWidgets) return allWidgets[name]
    return () => <div>Did not find widget: {name} </div>
  }

  const value = {
    getWidget,
    dataSourceId,
    documentId,
    onOpen,
  }

  return (
    <RegistryContext.Provider value={value}>
      {children}
    </RegistryContext.Provider>
  )
}
