import {Button, Card, Label, Progress, Typography} from "@equinor/eds-core-react";
import {hasExpertRole} from "../../../utils/auth";
import Icons from "../../../components/Design/Icons";
import React, {useContext, useState} from "react";
import {TAnalysis} from "../Types";
import {CustomScrim} from "../../../components/CustomScrim";
import {AccessControlList, AuthContext, DmssAPI} from "@dmt/common";
import {DEFAULT_DATASOURCE_ID} from "../../../const";
import styled from "styled-components";
import {edit_text} from "@equinor/eds-icons";
import JobApi from "../../Jobs/JobApi";
import {NotificationManager} from 'react-notifications'

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
`
const CardWrapper = styled.div`
  height: auto;
  width: 400px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 320px);
  grid-gap: 32px 32px;
  border-radius: 5px;
`

type AnalysisInfoCardProps = {
    analysis: TAnalysis
}

const RunAnalysisButton = (props: any) => {
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
        <Button onClick={() => saveAndStartJob()}>
            Run analysis
            <Icons name="play" title="play"/>
        </Button>
    )
}


const AnalysisInfoCard = (props: AnalysisInfoCardProps) => {
    const {analysis} = props
    const [viewACL, setViewACL] = useState<boolean>(false)
    const {tokenData} = useContext(AuthContext)

    const hasDefinedTask = 'workflow' in analysis && 'tasks' in analysis.workflow;

    return (
        <CardWrapper>
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
                        <FlexWrapper>
                            <Label label="Created:"/>
                            {new Date(analysis.created).toLocaleString(navigator.language)}
                        </FlexWrapper>
                        <FlexWrapper>
                            <Label label="Updated:"/>
                            {new Date(analysis.updated).toLocaleString(navigator.language)}
                        </FlexWrapper>
                        <FlexWrapper>
                            <Label label="Description:"/>
                            {analysis.description}
                        </FlexWrapper>
                    </div>
                </div>
                <Card.Actions>
                    <Button>
                        Edit
                        <Icons name="edit_text" title="edit_text"/>
                    </Button>
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
                    {hasDefinedTask && (
                        <>
                            <RunAnalysisButton analysis={analysis}/>
                            <Button>
                                Configure schedule
                                <Icons name="time" title="time"/>
                            </Button>
                        </>
                    )}
                </Card.Actions>
            </Card>
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
        </CardWrapper>
    )
}

export default AnalysisInfoCard