import { DmtUIPlugin, UIPluginSelector, useDocument } from '@dmt/common'
import * as React from 'react'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Tooltip } from '@equinor/eds-core-react'

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
  border-bottom: ${(props: any) =>
    (props.active == true && '3px red solid') || '3px grey solid'};
  font-size: medium;
`

const BaseTab = styled(Tab)`
  background-color: #024654;
  color: white;
`

const ChildTab = styled(Tab)`
  background-color: #d1d1d1;
`

const DotWrapper = styled.div`
  height: 3px;
  color: orange;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 5px;
`

type TChildTab = {
  attribute: string
  entity: any
  categories?: string[]
  absoluteDottedId: string
  onSubmit: Function
}

type TStringMap = {
  [key: string]: TChildTab
}

export const TabsContainer = (props: DmtUIPlugin) => {
  const {
    documentId,
    dataSourceId,
    onSubmit,
    onChange,
    config,
    document,
  } = props
  const [selectedTab, setSelectedTab] = useState<string>('home')
  const [formData, setFormData] = useState<any>({})
  const [childTabs, setChildTabs] = useState<TStringMap>({})
  const [entity, _loading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId,
    true
  )

  useEffect(() => {
    if (!entity) return
    setFormData({ ...entity })
  }, [entity])

  useEffect(() => {
    if (onChange) onChange(formData)
  }, [formData])

  if (!entity || Object.keys(formData).length === 0) return null

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          width: '100%',
          flexDirection: 'row',
          display: 'flex',
          borderBottom: '1px black solid',
        }}
      >
        <Tooltip enterDelay={600} title={document.type} placement="top-start">
          <BaseTab
            onClick={() => setSelectedTab('home')}
            active={selectedTab === 'home'}
          >
            {selectedTab === 'home' && (
              <DotWrapper style={{ color: 'orange' }}>&#9679;</DotWrapper>
            )}
            Base
          </BaseTab>
        </Tooltip>
        {Object.values(childTabs).map((tabData: any) => (
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
              {selectedTab === tabData.attribute && (
                <DotWrapper style={{ color: 'orange' }}>&#9679;</DotWrapper>
              )}
              {tabData.attribute}
            </ChildTab>
          </Tooltip>
        ))}
      </div>

      {selectedTab === 'home' ? (
        <UIPluginSelector
          key={'home'}
          absoluteDottedId={`${dataSourceId}/${documentId}`}
          entity={formData}
          categories={config?.subCategories.filter(
            (c: string) => c !== 'container'
          )} // Cannot render the 'tabs' plugin here. That would cause a recursive loop
          onSubmit={(newFormData: any) =>
            setFormData({ ...formData, ...newFormData })
          }
          onChange={(newFormData: any) =>
            setFormData({ ...formData, ...newFormData })
          }
          onOpen={(tabData: any) => {
            setChildTabs({ ...childTabs, [tabData.attribute]: tabData })
            setSelectedTab(tabData.attribute)
          }}
        />
      ) : (
        <UIPluginSelector
          key={selectedTab}
          absoluteDottedId={childTabs[selectedTab].absoluteDottedId}
          entity={childTabs[selectedTab].entity}
          categories={childTabs[selectedTab].categories}
          onSubmit={(newFormData: any) =>
            setFormData({
              ...formData,
              [selectedTab]: newFormData,
            })
          }
          onChange={(newFormData: any) =>
            setFormData({
              ...formData,
              [selectedTab]: newFormData,
            })
          }
        />
      )}
      {onChange === undefined && (
        <div
          style={{
            justifyContent: 'space-around',
            display: 'flex',
            width: '100%',
            margin: '5px',
          }}
        >
          <Button
            as="button"
            variant="outlined"
            color="danger"
            onClick={() => setFormData({ ...entity })}
          >
            Reset
          </Button>
          <Button
            as="button"
            onClick={() => {
              if (onSubmit) {
                onSubmit(formData)
              } else {
                updateDocument(formData, true)
              }
            }}
          >
            Ok
          </Button>
        </div>
      )}
    </div>
  )
}
