import {
  DmtUIPlugin,
  EntityPicker,
  JobHandlerPicker,
  TReference,
  UIPluginSelector,
  useDocument,
} from '@dmt/common'
import * as React from 'react'
import { useState } from 'react'
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

export const EditReverseTask = (props: DmtUIPlugin) => {
  const { document, documentId, dataSourceId, onSubmit } = props
  // using the passed updateDocument from props causes way too much rerendering. This should probably be fixed...
  const [_document, documentLoading, updateDocument, error] = useDocument(
    dataSourceId,
    documentId
  )
  const [formData, setFormData] = useState<any>({ ...document })
  return (
    <div
      style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
    >
      <div style={{ maxWidth: '900px', width: '100%', marginBottom: '10px' }}>
        <Wrapper>
          <HeaderWrapper>
            <Typography variant="h3">Input</Typography>
            <GroupWrapper>
              <div style={{ display: 'flex' }}>
                <Column>
                  <Label label={'Input entity'} />
                  <EntityPicker
                    formData={formData.applicationInput}
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
              </div>
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
                  formData={formData?.runner?.type}
                />
                <div
                  style={{
                    margin: '10px 20px',
                    borderLeft: '2px solid grey',
                    paddingLeft: '10px',
                  }}
                >
                  <UIPluginSelector
                    absoluteDottedId={`${dataSourceId}/${documentId}.runner`}
                    entity={{ ...formData?.runner }}
                    breadcrumb={false}
                    categories={['edit']}
                  />
                </div>
              </Column>
            </GroupWrapper>
          </HeaderWrapper>

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
        </Wrapper>
      </div>
    </div>
  )
}
