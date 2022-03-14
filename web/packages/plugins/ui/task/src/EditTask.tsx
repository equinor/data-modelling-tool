import {
  DmtUIPlugin,
  EntityPicker,
  JobHandlerPicker,
  SimpleBlueprintPicker,
  TReference,
  UIPluginSelector,
  useDocument,
} from '@dmt/common'
import * as React from 'react'
import { useEffect, useState } from 'react'
import { Button, Label, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

const Wrapper = styled.div`
  margin: 10px;
`

const Column = styled.div`
  display: block;
`

const GroupWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  flex-wrap: wrap;
`

const HeaderWrapper = styled.div`
  margin-bottom: 50px;
`

export const EditTask = (props: DmtUIPlugin) => {
  const {
    document,
    documentId,
    dataSourceId,
    onSubmit,
    onOpen,
    onChange,
    categories,
  } = props
  const [_document, _loading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId
  )
  const [formData, setFormData] = useState<any>({ ...document })
  const defaultRunnerType = 'WorkflowDS/Blueprints/jobHandlers/AzureContainer'

  useEffect(() => {
    if (!_document) return
    // onChange is an indicator if the plugin is used within another plugin. If so, don't override formData
    if (!onChange) setFormData({ ..._document })
  }, [_document])

  useEffect(() => {
    if (onChange) onChange(formData)
  }, [formData])

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    >
      <div style={{ maxWidth: '900px', width: '100%', marginBottom: '10px' }}>
        <Wrapper>
          <HeaderWrapper>
            <Typography variant="h3">Input</Typography>
            <GroupWrapper>
              <Column>
                <Label label={'Blueprint'} />
                <SimpleBlueprintPicker
                  onChange={(selectedBlueprint: string) =>
                    setFormData({ ...formData, inputType: selectedBlueprint })
                  }
                  formData={formData.inputType}
                />
              </Column>
              <div style={{ display: 'flex' }}>
                <Column>
                  <Label label={'Input entity'} />
                  <EntityPicker
                    formData={formData.input}
                    onChange={(selectedEntity: TReference) =>
                      setFormData({
                        ...formData,
                        input: {
                          _id: selectedEntity._id,
                          name: selectedEntity.name,
                          type: selectedEntity.type,
                        },
                      })
                    }
                  />
                </Column>
                <Button style={{ margin: '15px 10px 0 10px' }} disabled>
                  Create
                </Button>
              </div>
            </GroupWrapper>
          </HeaderWrapper>

          <HeaderWrapper>
            <Typography variant="h3">Output</Typography>
            <GroupWrapper>
              <Column>
                <Label label={'Blueprint'} />
                <SimpleBlueprintPicker
                  onChange={(selectedBlueprint: string) =>
                    setFormData({ ...formData, outputType: selectedBlueprint })
                  }
                  formData={formData.outputType}
                />
              </Column>
            </GroupWrapper>
          </HeaderWrapper>

          <HeaderWrapper>
            <Typography variant="h3">Job runner</Typography>
            <GroupWrapper>
              <Column style={{ width: '-webkit-fill-available' }}>
                <Label label={'Blueprint'} />
                <JobHandlerPicker
                  onChange={(selectedBlueprint: string) =>
                    setFormData({
                      ...formData,
                      runner: { ...formData?.runner, type: selectedBlueprint },
                    })
                  }
                  formData={formData?.runner?.type || defaultRunnerType}
                />
                <div
                  style={{
                    margin: '10px 20px',
                    borderLeft: '2px solid grey',
                    paddingLeft: '10px',
                  }}
                >
                  {onOpen ? (
                    <Button
                      onClick={() =>
                        onOpen({
                          attribute: 'runner',
                          entity: formData?.runner || {
                            type: defaultRunnerType,
                          },
                          absoluteDottedId: `${dataSourceId}/${documentId}.runner`,
                          onSubmit: (data: any) =>
                            setFormData({ ...formData, runner: data }),
                        })
                      }
                    >
                      Open
                    </Button>
                  ) : (
                    <UIPluginSelector
                      absoluteDottedId={`${dataSourceId}/${documentId}.runner`}
                      entity={formData?.runner || { type: defaultRunnerType }}
                      breadcrumb={false}
                      categories={categories}
                      onSubmit={(data: any) =>
                        setFormData({ ...formData, runner: data })
                      }
                    />
                  )}
                </div>
              </Column>
            </GroupWrapper>
          </HeaderWrapper>

          {onChange === undefined && (
            <div style={{ justifyContent: 'space-around', display: 'flex' }}>
              <Button
                as="button"
                variant="outlined"
                color="danger"
                onClick={() => setFormData({ ...document })}
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
        </Wrapper>
      </div>
    </div>
  )
}
