import {DmtSettings} from "@dmt/common";
import useSearch from "../../hooks/useSearch";
import {Blueprints} from "../../Enums";
import {Progress} from "@equinor/eds-core-react";
import React from "react";
import DynamicTable from "../../components/DynamicTable";
import {DEFAULT_DATASOURCE_ID} from "../../const";

const columns: Array<string> = [
    'Analysis name',
    'Description',
    'Created',
    'Updated',
    'Creator',
    'Schedule',
    'Latest result',
]

type TAnalysisRow = {
    _id?: string
    name: string
    description: string
    created: string
    updated: string
    creator: string
    schedule?: string
}

type TAnalysis = {
    _id: string
    name: string
    description: string
    created: string
    updated: string
    label?: string
    creator: string
    schedule: string
}

const onRowClicked = (event: any) => {
    const documentId = event.target.parentElement.accessKey
    document.location = `${document.location.pathname}/${DEFAULT_DATASOURCE_ID}/${documentId}`
}

const AnalysisOverview = (props: DmtSettings) => {
    const [analysis, isLoading, hasError] = useSearch(
        Blueprints.ANALYSIS
    )
    if (isLoading) {
        return <Progress.Linear/>;
    }

    const rows: Array<TAnalysisRow> = []
    analysis?.forEach((analysis: TAnalysis) => {
        let row: TAnalysisRow = {
            _id: analysis._id,
            name: analysis.label || analysis.name,
            description: "This is analysis for...",
            created: "01.01.2022",
            updated: "03.02.2022",
            creator: analysis.creator,
            schedule: analysis.schedule || "every 2 day",
            result: "LINK (3 days ago)"
        }
        rows.push(row)
    })

    return (
        <>
            <DynamicTable columns={columns} rows={rows} onRowClicked={onRowClicked}/>
        </>
    )
}

export default AnalysisOverview