// @ts-nocheck

import {
  ApplicationContext,
  AuthContext,
  DMSS_ADMIN_ROLE,
  DmssAPI,
} from '@development-framework/dm-core'
import { MemoryRouter } from 'react-router-dom'
import React, { ReactNode } from 'react'

export const mockSearch = (result: Array<any>) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'search')
  //@ts-ignore
  mock.mockImplementation(() =>
    Promise.resolve({
      data: result,
    })
  )
  return mock
}

export type TTestWrapper = {
  roles?: string[]
  children?: ReactNode
  settings?: any
}

export const TestWrapper = (props: TTestWrapper) => {
  const { roles, children, settings } = props
  const value = {
    tokenData: {
      roles: roles || [DMSS_ADMIN_ROLE],
    },
  }
  return (
    <ApplicationContext.Provider value={settings}>
      <AuthContext.Provider value={value}>
        <MemoryRouter>{children}</MemoryRouter>
      </AuthContext.Provider>
    </ApplicationContext.Provider>
  )
}
