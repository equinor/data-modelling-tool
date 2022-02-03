import styled from "styled-components";
import {Button, Card, Typography} from "@equinor/eds-core-react";
import useSearch from "../../../hooks/useSearch";
import {Blueprints} from "../../../Enums";
import {Heading} from "../../../components/Design/Fonts";
import React from "react";
import {TTask} from "../Types";

type TaskTypeProps = {
    task: TTask
    onSelectType: Function
}

const TaskWrapper = styled.div`
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05), 0 0 40px rgba(0, 0, 0, 0.08);
`

const CardWrapper = styled.div`
  height: auto;
  width: 100%;
  padding: 32px;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, 320px);
  grid-gap: 32px 32px;
`

const Task = (props: TaskTypeProps): JSX.Element => {
    const {task, onSelect} = props
    return (
        <TaskWrapper>
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
                    <Button onClick={() => onSelect(task.name)}>Select</Button>
                </Card.Actions>
            </Card>
        </TaskWrapper>
    )
}

type AnalysisChooserProps = {
    onSelectType: Function
}

const AnalysisChooser = (props: AnalysisChooserProps): JSX.Element => {
    const {onSelectType} = props

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
                        return (<Task key={task.name} task={task} onSelect={onSelectType}/>)
                    })
                }
            </CardWrapper>
        </>
    )
}

export default AnalysisChooser