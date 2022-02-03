import React, {useContext} from 'react'
import {useParams} from 'react-router-dom'
import {AuthContext, DmtAPI, useDocument} from '@dmt/common'
import AnalysisDetails from './components/AnalysisDetails'
import AnalysisChooser from "./components/AnalysisChooser";
import AnalysisInfoCard from "./components/AnalysisInfoCard";
import {Divider} from "@equinor/eds-core-react";

export default (): JSX.Element => {
    const {data_source, entity_id} = useParams()
    const [analysis, isLoading, updateDocument, error] = useDocument(
        data_source,
        entity_id
    )
    const {token} = useContext(AuthContext)

    if (isLoading) return <>Loading...</>

    const handleTypeSelected = (type: string) => {
        const dmtAPI = new DmtAPI()
        dmtAPI.createEntity(`WorkflowDS/Blueprints/tasks/${type}`, token).then((instance: any) => {
            const updatedAnalysis = {
                ...analysis,
                workflow: {
                    tasks: [instance]
                }
            }
            updateDocument(updatedAnalysis)
        })
    }

    const hasDefinedTask = 'workflow' in analysis && 'tasks' in analysis.workflow;

    return (
        <>
            <AnalysisInfoCard analysis={analysis}/>
            <Divider variant="medium"/>
            {
                hasDefinedTask ?
                    <AnalysisDetails analysis={analysis}/> :
                    <AnalysisChooser onSelectType={handleTypeSelected}/>
            }
        </>
    )
}
