import {Button, Progress, Table, Typography} from "@equinor/eds-core-react";
import React, {useContext, useState} from "react";
import styled from "styled-components";
import {AuthContext, DmssAPI} from "@dmt/common";
import {TAnalysis} from "../Types";
import {DEFAULT_DATASOURCE_ID,} from '../../../const'
import Icons from '../../../components/Design/Icons'
import {primaryGray} from '../../../components/Design/Colors'
import {NotificationManager} from 'react-notifications'
import JobApi from '../../Jobs/JobApi'

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

type AnalysisJobTableProps = {
    analysis: TAnalysis
}


const AnalysisJobTable = (props: AnalysisJobTableProps) => {
    const {analysis} = props
    const [loading, setLoading] = useState<boolean>(false)
    const {token, tokenData} = useContext(AuthContext)
    const dmssAPI = new DmssAPI(token)
    const jobAPI = new JobApi(token)

    const task = analysis.workflow.tasks[0]

    const analysisAbsoluteReference = `${DEFAULT_DATASOURCE_ID}/${analysis._id}`

    const saveAndStartJob = () => {
        setLoading(true)
        const newWorkflowRun: any = {
            type: 'WorkflowDS/Blueprints/WorkflowRun',
            started: '2022-01-01T12:06:39+0000',
            ended: '2022-01-31T12:06:39+0000',
            jobs: [
                {
                    type: 'WorkflowDS/Blueprints/jobs/Shell',
                    script: 'echo "Hello World"',
                },
            ],
            result: {},
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
        <>
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
        </>
    )
}

export default AnalysisJobTable