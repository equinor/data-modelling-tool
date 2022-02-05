import React, { useState } from 'react'
import { Tabs } from '@equinor/eds-core-react'

import AnalysisJobTable from './AnalysisJobTable'
import { UIPluginSelector } from '@dmt/common'

export default (props: { analysis: any }): JSX.Element => {
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
            <UIPluginSelector
              entity={analysis.workflow.tasks[0]}
              dottedId={`${analysis._id}.workflow.tasks.0`}
            />
          </Tabs.Panel>
          <Tabs.Panel>
            <AnalysisJobTable analysis={analysis} />
          </Tabs.Panel>
        </Tabs.Panels>
      </Tabs>
    </>
  )
}
