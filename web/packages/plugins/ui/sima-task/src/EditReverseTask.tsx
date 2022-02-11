import {
  BlueprintPicker,
  DmtUIPlugin,
  EntityPicker,
  EntityPickerDropdown,
  TReference,
  UploadFileButton,
  useDocument,
} from '@dmt/common'
import * as React from 'react'
import { ChangeEvent, useState } from 'react'
import { Button, Label, TextField, Typography } from '@equinor/eds-core-react'
import styled from 'styled-components'

const STaskBlueprint = 'AnalysisPlatformDS/Blueprints/STask'

const Wrapper = styled.div`
  margin: 10px;
`

const Column = styled.div`
  display: block;
`

const Row = styled.div`
  display: flex;
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
  const { document, documentId, dataSourceId } = props
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
                    formData={formData.defaultInput}
                    onChange={(selectedEntity: TReference) =>
                      setFormData({
                        ...formData,
                        defaultInput: {
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
            <Typography variant="h3">Job type</Typography>
            <GroupWrapper>
              <Column>
                <Label label={'Blueprint'} />
                <BlueprintPicker
                  onChange={(selectedBlueprint: string) =>
                    setFormData({ ...formData, jobType: selectedBlueprint })
                  }
                  formData={formData.jobType}
                />
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
            <Button as="button" onClick={() => updateDocument(formData, true)}>
              Ok
            </Button>
          </div>
        </Wrapper>
      </div>
    </div>
  )
}
