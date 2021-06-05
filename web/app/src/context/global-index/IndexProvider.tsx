import React, { createContext, useContext } from 'react'

import {
  DataSource,
  IIndexAPI,
  IIndex,
  useIndex,
  ApplicationContext,
} from '@dmt/common'

export interface IModels {
  index: IIndex
}

export interface IOperations {}

export interface IGlobalIndex {
  models: IModels
  operations: IOperations
}

const IndexContext = createContext<IGlobalIndex>(null!)

export const useGlobalIndex = () => {
  const context = useContext(IndexContext)
  if (!context) {
    throw new Error('useIndex must be used within a IndexProvider')
  }
  return context
}

interface IndexProviderProps {
  dataSources: DataSource[]
  indexApi: IIndexAPI
  children?: any
}

const IndexProvider = (props: IndexProviderProps) => {
  const { dataSources, indexApi, children } = props
  const application = useContext(ApplicationContext)
  const index = useIndex({ dataSources, application, indexApi })

  const value: IGlobalIndex = {
    models: {
      index,
    },
    operations: {},
  }

  return <IndexContext.Provider value={value}>{children}</IndexContext.Provider>
}

export default IndexProvider
