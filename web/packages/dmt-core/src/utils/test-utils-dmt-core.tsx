// @ts-nocheck

import { DmssAPI } from '../services/api/DmssAPI'
import React from 'react'

export const mockGetDocument = (result: Array<any>, shouldFail: boolean) => {
  const mock = jest.spyOn(DmssAPI.prototype, 'documentGetById')
  //@ts-ignore
  !shouldFail
    ? mock.mockImplementation(() =>
        Promise.resolve({
          data: result,
        })
      )
    : mock.mockImplementation(() => Promise.reject('error'))
  return mock
}
