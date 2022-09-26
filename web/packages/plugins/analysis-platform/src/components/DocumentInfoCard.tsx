import { Button, Card, Label, Typography } from '@equinor/eds-core-react'
import Icons from './Design/Icons'
import React, { useContext, useState } from 'react'
import {
  AccessControlList,
  AuthContext,
  Dialog,
  hasOperatorRole,
  hasExpertRole,
} from '@development-framework/dm-core'
import { TDocumentInfoCardProps } from '../Types'
import styled from 'styled-components'

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`
const CardWrapper = styled.div`
  height: auto;
  width: 400px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(1, auto);
  grid-gap: 32px 32px;
  border-radius: 5px;
`

export const DocumentInfoCard = (props: TDocumentInfoCardProps) => {
  const {
    document,
    dataSourceId,
    fields,
    actions,
    disableDefaultFields,
    disableDefaultActions,
  } = props
  const [viewACL, setViewACL] = useState<boolean>(false)
  const { tokenData } = useContext(AuthContext)

  return (
    <CardWrapper>
      <Card style={{ maxWidth: '1200px' }}>
        <Card.Header>
          <Card.HeaderTitle>
            <Typography variant="h5">
              {document.label || document.name}
            </Typography>
          </Card.HeaderTitle>
        </Card.Header>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {!disableDefaultFields && (
              <>
                {document.creator && (
                  <FlexWrapper>
                    <Label label="Creator:" />
                    {document.creator}
                  </FlexWrapper>
                )}
                {document.created && (
                  <FlexWrapper>
                    <Label label="Created:" />
                    {new Date(document.created).toLocaleString(
                      navigator.language
                    )}
                  </FlexWrapper>
                )}
                {document.updated && (
                  <FlexWrapper>
                    <Label label="Updated:" />
                    {new Date(document.updated).toLocaleString(
                      navigator.language
                    )}
                  </FlexWrapper>
                )}
                <FlexWrapper>
                  <Label label="Description:" />
                  {document.description}
                </FlexWrapper>
              </>
            )}
            <>
              {fields &&
                Object.entries(fields).map(([label, val]) => (
                  <FlexWrapper key={label}>
                    <Label label={label} />
                    {val}
                  </FlexWrapper>
                ))}
            </>
          </div>
        </div>
        {hasOperatorRole(tokenData) && (
          <Card.Actions>
            {actions}
            {!disableDefaultActions && (
              <>
                {hasExpertRole(tokenData) && (
                  <Button
                    onClick={() => setViewACL(!viewACL)}
                    style={{ width: 'max-content' }}
                  >
                    Access control
                    <Icons name="assignment_user" title="assignment_user" />
                  </Button>
                )}
              </>
            )}
          </Card.Actions>
        )}
      </Card>
      <Dialog
        isOpen={viewACL}
        header={'Access control'}
        closeScrim={() => setViewACL(false)}
      >
        <AccessControlList
          documentId={document._id}
          dataSourceId={dataSourceId}
        />
      </Dialog>
    </CardWrapper>
  )
}
