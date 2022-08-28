import React, {useContext} from 'react'
import {
    DynamicTable
} from 'dmt-core'
// @ts-ignore
import components from './hooks.json'

const columns: Array<string> = [
    'Name',
    'Type',
    'Optional',
    'Description'
]

type TAnalysisRow = {
    _id?: string
    name: string
    type: string
    optional: string
    description: string
}

type HooksProps = {
    hookName: string
}

export const HooksComment = (props: HooksProps) => {
    const {hookName} = props
    const hook = components.children.find((child: any) => child.name === hookName)
    return <div>{hook["signatures"][0]["comment"]["summary"][0]["text"]}</div>
}

export const HooksProps = (props: HooksProps) => {
    const {hookName} = props
    const hook = components.children.find((child: any) => child.name === hookName)
    const properties = hook.signatures[0].parameters
    const rows: Array<TAnalysisRow> = []
    Object.values(properties).forEach((propery: any, index: number) => {
        const row: TAnalysisRow = {
            _id: `${index}`,
            name: propery["name"],
            type: propery["type"].name,
            optional: propery["flags"]["isOptional"] ? "True" : "False",
            description: propery["comment"]["summary"][0]["text"]
        }
        rows.push(row)
    })

    return <DynamicTable columns={columns} rows={rows}/>
}
