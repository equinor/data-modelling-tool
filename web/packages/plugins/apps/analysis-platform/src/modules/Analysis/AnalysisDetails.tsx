import React, {useContext, useState} from 'react'
import {TOperation} from '../../Types'
import {hasExpertRole} from '../../utils/auth'
import {Button, Card, Label, Progress, Table, Typography} from '@equinor/eds-core-react'
import {StatusDot} from '../../components/Other'
import styled from 'styled-components'
import {LocationOnMap} from '../../components/Map'
import {TComment, TPhase} from '../../Types'
import {AccessControlList, AuthContext, DmssAPI} from '@dmt/common'
import {DEFAULT_DATASOURCE_ID, ENTITIES, RESULT_FOLDER_NAME} from '../../const'
import {CustomScrim} from '../../components/CustomScrim'
import {statusFromDates} from '../../utils/statusFromDates'
import Icons from '../../components/Design/Icons'
import {primaryGray} from "../../components/Design/Colors";
import {createContainerJob} from "../Jobs/createContainerJob";
import {NotificationManager} from 'react-notifications'
import JobApi from "../Jobs/JobApi";

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
    const [loading, setLoading] = useState<boolean>(false)
    const {token, tokenData} = useContext(AuthContext)
    const dmssAPI = new DmssAPI(token);
    const jobAPI = new JobApi(token)

    const task = analysis.workflow.tasks[0];

    const analysisAbsoluteReference = `${DEFAULT_DATASOURCE_ID}/${analysis._id}`

    const saveAndStartJob = () => {
        setLoading(true)
        const newWorkflowRun: any = {
            "type": "WorkflowDS/Blueprints/WorkflowRun",
            "started": "2022-01-01T12:06:39+0000",
            "ended": "2022-01-31T12:06:39+0000",
            "jobs": [
                {
                    "type": "WorkflowDS/Blueprints/jobs/Shell",
                    "script": "echo \"Hello World\""
                }
            ],
            "result": {

            }
        }
        dmssAPI.generatedDmssApi
            .explorerAdd({
                absoluteRef: `${analysisAbsoluteReference}.workflow.runs`,
                updateUncontained: false,
                body: newWorkflowRun,
            })
            .then((res: any) => {
                // Add the new job to the state
                // TODO: setJobs([newJob, ...jobs])
                // Start a job from the created job entity (last one in list)
                jobAPI
                    .startJob(`${analysisAbsoluteReference}.workflow.runs.0.jobs.0`)
                    .then((result: any) => {
                        NotificationManager.success(
                            JSON.stringify(result.data),
                            'Simulation job started'
                        )
                    })
                    .catch((error: Error) => {
                        console.error(error)
                        NotificationManager.error(
                            error?.response?.data?.message,
                            'Failed to start job'
                        )
                    })
                    .finally(() => setLoading(false))
            })
            .catch((error: Error) => {
                console.error(error)
                NotificationManager.error(
                    error?.response?.data?.message,
                    'Failed to start job'
                )
                setLoading(false)
            })
    }

    if (loading) {
        return <Progress.Linear/>
    }

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
                <StyledHeaderButton>
                    Configure schedule
                    <Icons name="time" title="time"/>
                </StyledHeaderButton>
                <StyledHeaderButton onClick={() => saveAndStartJob()}>
                    Run simulation
                    <Icons name="play" title="play"/>
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
