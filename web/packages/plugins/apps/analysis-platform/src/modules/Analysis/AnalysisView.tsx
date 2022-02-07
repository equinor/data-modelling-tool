import React, {useContext} from 'react'
import {useParams} from 'react-router-dom'
import {AuthContext, DmtAPI, useDocument} from '@dmt/common'
import AnalysisDetails from './components/AnalysisDetails'
import AnalysisChooser from "./components/AnalysisChooser";
import AnalysisInfoCard from "./components/AnalysisInfoCard";
import {Divider, Progress} from "@equinor/eds-core-react";
import {TAnalysis} from "./Types";

const hasDefinedTask = (analysis: TAnalysis) => 'workflow' in analysis && 'tasks' in analysis.workflow;

export default (): JSX.Element => {
    // @ts-ignore
    const {data_source, entity_id} = useParams()
    const [analysis, isLoading, updateDocument, error] = useDocument(
        data_source,
        entity_id
    )
    // @ts-ignore
    const {token} = useContext(AuthContext)

    if (isLoading) return <Progress.Linear/>

    const handleTypeSelected = (type: string) => {
        const dmtAPI = new DmtAPI()
        dmtAPI.createEntity(`WorkflowDS/Blueprints/tasks/${type}`, token).then((instance: any) => {
            // Update analysis with selected task type
            const updatedAnalysis = {
                ...analysis,
                workflow: {
                    type: "WorkflowDS/Blueprints/Workflow",
                    tasks: [instance]
                }
            }
            updateDocument(updatedAnalysis)
        })
    }

    return (
        <>
            <AnalysisInfoCard analysis={analysis}/>
            <Divider variant="medium"/>
            {
                hasDefinedTask(analysis) ?
                    <AnalysisDetails analysis={analysis}/> :
                    <AnalysisChooser onSelectType={handleTypeSelected}/>
            }
        </>
    )
}
