import React, { useState } from 'react'
import { TOperation } from '../../../Types'
import { Tabs } from '@equinor/eds-core-react'

import AnalysisTaskCard from './AnalysisTaskCard'
import AnalysisJobTable from './AnalysisJobTable'

export default (props: { analysis: TOperation }): JSX.Element => {
  const { analysis } = props
  const [activeTab, setActiveTab] = useState<number>(0)

  return (
    <>
      <Tabs
        activeTab={activeTab}
        onChange={(index: number) => setActiveTab(index)}
        variant={'minWidth'}
      >
        <Tabs.List>
          <Tabs.Tab>Tasks</Tabs.Tab>
          <Tabs.Tab>Runs</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panels>
          <Tabs.Panel>
            <AnalysisTaskCard analysis={analysis} />
          </Tabs.Panel>
          <Tabs.Panel>
            <AnalysisJobTable analysis={analysis} />
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </>
  )
}
