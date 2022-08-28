import React, {useContext} from 'react'
import {
    DynamicTable
} from 'dmt-core'
// @ts-ignore
import components from './components.json'

const columns: Array<string> = [
    'Name',
    'Type',
    'Description'
]

type TAnalysisRow = {
    _id?: string
    name: string
    type: string
    description: string
}

type ComponentProps = {
    file: string
}

export const ComponentProps = (props: ComponentProps) => {
    const {file} = props
    const properties = components[file][0]
    if (properties === undefined) return <div>None</div>

    const rows: Array<TAnalysisRow> = []
    // @ts-ignore
    Object.values(properties?.props).forEach((propery: any, index: number) => {
        const row: TAnalysisRow = {
            _id: propery._id,
            type: propery["type"].name,
            name: propery["name"],
            description: propery["description"]
        }
        rows.push(row)
    })

    return <DynamicTable columns={columns} rows={rows}/>
}
