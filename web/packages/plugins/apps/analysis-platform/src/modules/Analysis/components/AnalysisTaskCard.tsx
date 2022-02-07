import {TAnalysis} from "../Types";
import {Button, Progress, Table, Typography} from "@equinor/eds-core-react";
import {TPhase} from "../../../Types";
import React, {useContext, useState} from "react";

type AnalysisTaskCardProps = {
    analysis: TAnalysis
}

const AnalysisTaskCard = (props: AnalysisTaskCardProps) => {
    const {analysis} = props


    return (
        <>
            <Table density="comfortable" style={{width: '100%'}}>
                <Table.Caption>
                    <Typography variant="h3">Tasks</Typography>
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
                    {analysis.workflow.tasks.length &&
                    analysis.workflow.tasks.map((task: TPhase, index: number) => (
                        <Table.Row key={index}>
                            <Table.Cell>{task.name}</Table.Cell>
                            <Table.Cell>{task.type}</Table.Cell>
                            <Table.Cell>{task.inputType}</Table.Cell>
                            <Table.Cell>{task.outputType}</Table.Cell>
                            <Table.Cell>{task.outputTarget}</Table.Cell>
                            <Table.Cell>LINK</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </>
    )
}

export default AnalysisTaskCard