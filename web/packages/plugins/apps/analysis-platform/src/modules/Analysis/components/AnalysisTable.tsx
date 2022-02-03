import useSearch from '../../../hooks/useSearch'
import {Blueprints} from '../../../Enums'
import {Progress} from '@equinor/eds-core-react'
import React from 'react'
import DynamicTable from '../../../components/DynamicTable'
import {DEFAULT_DATASOURCE_ID} from '../../../const'
import {TAnalysis} from "../Types";
import {formatDate} from "../../../utils/dateFormater";

const columns: Array<string> = [
    'Analysis name',
    'Description',
    'Created',
    'Updated',
    'Creator'
]

type TAnalysisRow = {
    _id?: string
    name: string
    description: string
    created: Date | string
    updated: Date | string
    creator: string
}

const onRowClicked = (event: any) => {
    const documentId = event.target.parentElement.accessKey
    document.location = `${document.location.pathname}/${DEFAULT_DATASOURCE_ID}/${documentId}`
}


const AnalysisTable = () => {
    const [analysis, isLoading, hasError] = useSearch({
        type: Blueprints.ANALYSIS
    })

    if (isLoading) {
        return <Progress.Linear/>
    }

    const rows: Array<TAnalysisRow> = []
    analysis?.forEach((analysis: TAnalysis) => {
        let row: TAnalysisRow = {
            _id: analysis._id,
            name: analysis.label || analysis.name,
            description: analysis.description,
            created: formatDate(analysis.created),
            updated: formatDate(analysis.updated),
            creator: analysis.creator
        }
        rows.push(row)
    })

    return (
        <>
            <DynamicTable columns={columns} rows={rows} onRowClicked={onRowClicked}/>
        </>
    )
}

export default AnalysisTable
