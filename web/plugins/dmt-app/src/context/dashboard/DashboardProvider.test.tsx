import React from 'react'
import { act, renderHook } from '@testing-library/react-hooks'
import DashboardProvider, { useDashboard } from './DashboardProvider'
import { ApplicationContext, DataSources, IDataSourceAPI } from '@dmt/common'
import { mock } from 'jest-mock-extended'

const wrapper: React.FC = ({ children, application, api }: any) => (
  <ApplicationContext.Provider value={application}>
    <DashboardProvider dataSourceApi={api}>{children}</DashboardProvider>
  </ApplicationContext.Provider>
)

describe('the dashboard provider component', () => {
  const application = { name: 'testApp', visibleDataSources: ['localhost'] }

  describe('when provider is initialized', () => {
    it('should correctly return the DashboardContext object', async () => {
      await act(async () => {
        const api = mock<IDataSourceAPI>()
        const { result, waitForNextUpdate } = renderHook(useDashboard, {
          wrapper,
          initialProps: {
            application,
            api,
          },
        })
        await waitForNextUpdate()
        expect(result.current).toMatchObject({
          models: {
            layout: expect.any(Object),
            dataSources: expect.any(Object),
          },
          operations: {},
        })
      })
    })

    it('should have fetched the index for all data sources', async () => {
      const api = mock<IDataSourceAPI>()
      const dataSources: DataSources = [
        {
          id: 'localhost',
          name: 'localhost',
        },
      ]
      api.getAll.mockImplementation(() => Promise.resolve(dataSources))

      const { result, waitForNextUpdate } = renderHook(useDashboard, {
        wrapper,
        initialProps: {
          application,
          api,
        },
      })
      await waitForNextUpdate()

      expect(api.getAll).toHaveBeenCalledTimes(1)
      expect(result.current.models.dataSources.models.dataSources).toEqual(
        dataSources
      )
    })
  })
})