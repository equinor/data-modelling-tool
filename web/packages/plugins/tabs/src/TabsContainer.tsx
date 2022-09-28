import {
  IDmtUIPlugin,
  Loading,
  TChildTab,
  TGenericObject,
  UIPluginSelector,
  useDocument,
} from '@development-framework/dm-core'
import * as React from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Icon, Tooltip } from '@equinor/eds-core-react'
import { TabsProvider } from './TabsContext'

interface ITabs {
  active: boolean
}

const Tab = styled.div<ITabs>`
  width: fit-content;
  height: 30px;
  padding: 2px 15px;
  align-self: self-end;
  &:hover {
    color: gray;
  }
  cursor: pointer;
  border-bottom: ${(props: ITabs) =>
    (props.active == true && '3px red solid') || '3px grey solid'};
  font-size: medium;
`

const BaseTab = styled(Tab as any)`
  background-color: #024654;
  color: white;
`

const ChildTab = styled(Tab as any)`
  background-color: #d1d1d1;
`

const HidableWrapper = styled.div<any>`
display: ${(props: { hidden: boolean }) => (props.hidden && 'none') || 'flex'}
align-self: normal;
`

type TStringMap = {
  [key: string]: TChildTab
}

export const TabsContainer = (props: IDmtUIPlugin) => {
  const { documentId, dataSourceId, config, onSubmit } = props
  const [selectedTab, setSelectedTab] = useState<string>('home')
  const [formData, setFormData] = useState<TGenericObject>({})
  const [childTabs, setChildTabs] = useState<TStringMap>({})
  const [entity, loading] = useDocument<TGenericObject>(
    dataSourceId,
    documentId
  )

  useEffect(() => {
    if (!entity) return
    setFormData({ ...entity })
  }, [entity])

  if (!entity || Object.keys(formData).length === 0) return null

  const handleOpen = (tabData: TChildTab) => {
    setChildTabs({ ...childTabs, [tabData.attribute]: tabData })
    setSelectedTab(tabData.attribute)
  }
  if (loading) {
    return <Loading />
  }
  return (
    <TabsProvider onOpen={handleOpen}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            width: '100%',
            flexDirection: 'row',
            display: 'flex',
            borderBottom: '1px black solid',
          }}
        >
          <Tooltip enterDelay={600} title={entity.type} placement="top-start">
            <BaseTab
              onClick={() => setSelectedTab('home')}
              active={selectedTab === 'home'}
            >
              <Icon name="home" size={24} />
            </BaseTab>
          </Tooltip>
          {Object.values(childTabs).map((tabData: TChildTab) => (
            <Tooltip
              key={tabData.attribute}
              enterDelay={600}
              title={tabData.entity.type}
              placement="top-start"
            >
              <ChildTab
                onClick={() => setSelectedTab(tabData.attribute)}
                active={selectedTab === tabData.attribute}
              >
                {tabData.attribute}
              </ChildTab>
            </Tooltip>
          ))}
        </div>
        <HidableWrapper hidden={'home' !== selectedTab}>
          <UIPluginSelector
            key={'home'}
            absoluteDottedId={`${dataSourceId}/${documentId}`}
            type={formData.type}
            categories={config?.subCategories?.filter(
              (c: string) => c !== 'container'
            )} // Cannot render the 'tabs' plugin here. That would cause a recursive loop
            onOpen={(tabData: TChildTab) => {
              setChildTabs({ ...childTabs, [tabData.attribute]: tabData })
              setSelectedTab(tabData.attribute)
            }}
            onSubmit={(newFormData: TGenericObject) => {
              setFormData({ ...newFormData })
              if (onSubmit) {
                onSubmit(newFormData)
              }
            }}
          />
        </HidableWrapper>
        {Object.values(childTabs).map((childTab: TChildTab) => {
          return (
            <HidableWrapper
              key={childTab.attribute}
              hidden={childTab.attribute !== selectedTab}
            >
              <UIPluginSelector
                absoluteDottedId={childTab.absoluteDottedId}
                type={childTab.entity.type}
                categories={childTab.categories}
                onSubmit={(data: TChildTab) => {
                  const newFormData = {
                    ...formData,
                    [childTab.attribute]: data,
                  }
                  setFormData(newFormData)
                  if (childTab?.onSubmit) {
                    childTab.onSubmit(data)
                  }
                }}
              />
            </HidableWrapper>
          )
        })}
      </div>
    </TabsProvider>
  )
}
