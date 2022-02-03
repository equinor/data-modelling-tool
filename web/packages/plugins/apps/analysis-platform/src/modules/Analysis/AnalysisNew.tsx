import {useState} from "react";
import {Heading} from "../../components/Design/Fonts";
import useSearch from "../../hooks/useSearch";
import {Blueprints} from "../../Enums";
import {Button, Card, Typography} from '@equinor/eds-core-react'
import React from "react";
import styled from "styled-components";

type AnalysisChooserProps = {
    onSelectType: Function
}
type TTask = {
    name: string
    description: string
}

type TaskTypeProps = {
    task: TTask
}

const CardWrapper = styled.div`
  height: auto;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 320px);
  grid-gap: 32px 32px;
  background: #ebebeb;
`

const Task = (props: TaskTypeProps): JSX.Element => {
    const {task} = props
    return (
        <Card>
            <Card.Header>
                <Card.HeaderTitle>
                    <Typography variant="h5">{task.name}</Typography>
                </Card.HeaderTitle>
            </Card.Header>
            <div>
                <Typography variant="body_short">
                    {task.description}
                </Typography>
            </div>
            <Card.Actions>
                <Button>Create</Button>
            </Card.Actions>
        </Card>
    )
}

const AnalysisChooser = (props: AnalysisChooserProps): JSX.Element => {
    const [tasks, isLoading, hasError] = useSearch(
        {
            type: Blueprints.BLUEPRINT,
            extends: Blueprints.TASK
        },
        'WorkflowDS')

    if (isLoading) return <></>

    return (
        <>
            <Heading text="Choose analysis type" variant="h4"/>
            <CardWrapper>
                {
                    tasks.map((task: TTask) => {
                        console.log(task);
                        return (<Task key={task.name} task={task}/>)
                    })
                }
            </CardWrapper>
        </>
    )
}

const AnalysisNew = (): JSX.Element => {

    const [type, setType] = useState<string | null>(null)

    if (!type) {
        return <AnalysisChooser onSelectType={setType}/>
    }

    return (<></>)
}

export default AnalysisNew