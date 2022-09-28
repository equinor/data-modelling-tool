import { render, screen, waitFor, within } from '@testing-library/react'
import React from 'react'
import { AnalysisOverview } from './AnalysisOverview'
import { DMSS_ADMIN_ROLE, DOMAIN_ROLES } from '@development-framework/dm-core'
import { mockSearch, TestWrapper } from '../../utils/test-utils'

const settings = {
  name: '',
  label: '',
  tabIndex: 0,
  hidden: false,
  visibleDataSources: [],
  type: '',
  description: '',
  packages: '',
  models: '',
  actions: '',
  file_loc: '',
  data_source_aliases: '',
  urlPath: 'test-path',
}

describe('AnalysisOverview', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('create analysis', () => {
    DOMAIN_ROLES.forEach((role: string) => {
      it(`with the ${role} role should be able to create new analysis`, async () => {
        const mock = mockSearch([])
        const { container } = render(
          <TestWrapper roles={[role]} settings={settings}>
            <AnalysisOverview />
          </TestWrapper>
        )
        await waitFor(() => {
          expect(screen.getByText('Create new analysis')).toBeTruthy()
        })
      })
    })
    it(`with some other role should not be able to create new analysis`, async () => {
      const mock = mockSearch([])
      const { container } = render(
        <TestWrapper roles={['some-role']} settings={settings}>
          <AnalysisOverview />
        </TestWrapper>
      )
      await waitFor(() => {
        expect(screen.queryByText('Create new analysis')).toBeNull()
      })
    })
    it(`should re-direct to new analysis page`, async () => {
      const mock = mockSearch([])
      const { container } = render(
        <TestWrapper roles={[DMSS_ADMIN_ROLE]} settings={settings}>
          <AnalysisOverview />
        </TestWrapper>
      )
      await waitFor(() => {
        const createAnalysisButton = screen.queryByText('Create new analysis')
        expect(createAnalysisButton).toBeTruthy()
        // @ts-ignore
        expect(createAnalysisButton.closest('a').getAttribute('href')).toEqual(
          '/ap/analysis/new'
        )
      })
    })
  })

  describe('list analysis', () => {
    const searchHits = [
      {
        _id: '1',
        name: 'Analysis1',
        description: 'Description1',
      },
      {
        _id: '2',
        name: 'Analysis2',
        description: 'Description2',
      },
    ]
    it('should render list of analysis', async () => {
      const mock = mockSearch(searchHits)
      const { container } = render(
        <TestWrapper settings={settings}>
          <AnalysisOverview />
        </TestWrapper>
      )
      await waitFor(() => {
        // https://polvara.me/posts/five-things-you-didnt-know-about-testing-library
        searchHits.forEach((hit: any) => {
          const { name, description } = hit
          const row = screen.getByText(name).closest('tr')
          // @ts-ignore
          const utils = within(row) // Run getByText only inside the row you're considering at the moment.
          expect(utils.getByText(name)).toBeTruthy()
          expect(utils.getByText(description)).toBeTruthy()
        })

        expect(mock).toHaveBeenCalledWith({
          body: {
            type: 'AnalysisPlatformDS/Blueprints/Analysis',
          },
          dataSources: ['AnalysisPlatformDS'],
          sortByAttribute: undefined,
        })
        expect(mock).toHaveBeenCalledTimes(1)
      })
    })
  })
})
