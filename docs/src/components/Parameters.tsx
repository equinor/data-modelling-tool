import React from "react";
import { TComponentDocPartProps } from "../types";
import { extractParameterInfo } from "../utils";
import { Table } from "./Table";

const columns: Array<string> = ["Name", "Type", "Optional", "Description"];

type TTableRow = {
  _id?: string;
  name: string;
  type: string;
  optional: string;
  description: string;
};

export const Parameters = (props: TComponentDocPartProps) => {
  const { typeDoc, typeDocs } = props
  const title: JSX.Element = <h2>Parameters</h2>
  const rows: Array<TTableRow> = []

  let parameters = typeDoc.signatures && typeDoc.signatures.length > 0
    ? typeDoc.signatures[0].parameters
    : typeDoc.type?.declaration?.children
      ? typeDoc.type.declaration.children
      : []
  
  parameters.forEach((parameter: any, index: number) => {
    if (parameter.type.type === 'reference') {
      try {
        const reference = typeDocs.children.find((child: any) => child.id === parameter.type.id)
        const referenceChildren = reference.hasOwnProperty('children')
          ? reference.children
          : reference.type.declaration.children
          ?? []
        referenceChildren.forEach((child: any, _index: number) => {
          let parameterInfo = extractParameterInfo(child)
          let row: TTableRow = {
            _id: `${_index}`,
            name: `${parameter.name}.${child.name}`,
            ...parameterInfo,
          }
          rows.push(row)
        })
      } catch (refErr) {
        console.error('Something went wrong while fetching the reference')
        console.error(refErr)
      }
    } else {
      console.log(parameter)
      let parameterInfo = extractParameterInfo(parameter)
      let row: TTableRow = {
        _id: `${index}`,
        name: parameter.name,
        ...parameterInfo,
      }
      rows.push(row)
    }
  })

  return (
    <>
      {title}
      <Table columns={columns} rows={rows} onRowClicked={() => {}} />
    </>
  )
};
