import React, {useContext, useState} from 'react'
import {TOperation} from '../Types'
import {hasExpertRole} from '../../utils/auth'
import {Button, Card, Label, Table, Typography} from '@equinor/eds-core-react'
import {StatusDot} from '../Other'
import styled from 'styled-components'
import {LocationOnMap} from '../Map'
import {TComment, TPhase} from '../../Types'
import {AccessControlList, AuthContext} from '@dmt/common'
import {DEFAULT_DATASOURCE_ID} from '../../const'
import {CustomScrim} from '../CustomScrim'
import {statusFromDates} from '../../utils/statusFromDates'
import Icons from '../Design/Icons'
import {primaryGray} from "../Design/Colors";

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`

const StyledHeaderButton = styled(Button)`
  margin-left: 20px;
  &:disabled {
    margin-left: 20px;
  }
`
const SimHeaderWrapper = styled.div`
  display: flex;
  background-color: ${primaryGray};
  padding: 15px 30px;
  margin-bottom: 20px;
  justify-content: flex-start;
  align-items: center;
`

export default (props: {
    analysis: TOperation
    setActiveTab: Function
}): JSX.Element => {
    const {analysis, setActiveTab} = props
    const [viewACL, setViewACL] = useState<boolean>(false)
    const {tokenData} = useContext(AuthContext)

    return (
        <Card style={{maxWidth: '1200px'}}>
            <Card.Header>
                <Card.HeaderTitle>
                    <Typography variant="h5">
                        {analysis.label || analysis.name}
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
                <div style={{display: 'flex', flexDirection: 'column'}}>
                    <FlexWrapper>
                        <Label label="Creator:"/>
                        {analysis.creator}
                    </FlexWrapper>
                </div>

            </div>
            <Card.Actions>
                {hasExpertRole(tokenData) && (
                    <Button
                        onClick={() => {
                            setViewACL(!viewACL)
                        }}
                    >
                        Access control
                        <Icons name="assignment_user" title="assignment_user"/>
                    </Button>
                )}
            </Card.Actions>
            <SimHeaderWrapper>
                <StyledHeaderButton
                    onClick={() => setVisibleReoccurringJob(!visibleReoccurringJob)}
                >
                    Configure schedule
                    <Icons name="time" title="time"/>
                </StyledHeaderButton>
            </SimHeaderWrapper>

            {viewACL && (
                <CustomScrim
                    header={'Access control'}
                    closeScrim={() => setViewACL(false)}
                >
                    <AccessControlList
                        documentId={analysis._id}
                        dataSourceId={DEFAULT_DATASOURCE_ID}
                    />
                </CustomScrim>
            )}
            <Table density="comfortable" style={{width: '100%'}}>
                <Table.Caption>
                    <Typography variant="h3">Tasks in analysis</Typography>
                </Table.Caption>
                <Table.Head>
                    <Table.Row>
                        <Table.Cell>Task</Table.Cell>
                        <Table.Cell>Type</Table.Cell>
                        <Table.Cell>Input Type</Table.Cell>
                        <Table.Cell>Output Type</Table.Cell>
                        <Table.Cell>Output Target</Table.Cell>
                        <Table.Cell>Edit</Table.Cell>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    {analysis.workflow.tasks.length && (
                        analysis.workflow.tasks.map((task: TPhase, index: number) => (
                            <Table.Row
                                key={index}
                                style={{cursor: 'pointer'}}
                                onClick={() => setActiveTab(index + 1)}
                            >
                                <Table.Cell>{task.name}</Table.Cell>
                                <Table.Cell>{task.type}</Table.Cell>
                                <Table.Cell>{task.inputType}</Table.Cell>
                                <Table.Cell>{task.outputType}</Table.Cell>
                                <Table.Cell>{task.outputTarget}</Table.Cell>
                                <Table.Cell>LINK</Table.Cell>
                            </Table.Row>
                        ))
                    )}
                </Table.Body>
            </Table>
            <Table density="comfortable" style={{width: '100%'}}>
                <Table.Caption>
                    <Typography variant="h3">Runs</Typography>
                </Table.Caption>
                <Table.Head>
                    <Table.Row>
                        <Table.Cell>Status</Table.Cell>
                        <Table.Cell>Job</Table.Cell>
                        <Table.Cell>Duration</Table.Cell>
                        <Table.Cell>Result</Table.Cell>
                    </Table.Row>
                </Table.Head>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell>Success</Table.Cell>
                        <Table.Cell>1</Table.Cell>
                        <Table.Cell>2m 31s</Table.Cell>
                        <Table.Cell>LINK</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        </Card>
    )
}
