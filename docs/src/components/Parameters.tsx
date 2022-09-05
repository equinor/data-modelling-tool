import React from "react";
import { DynamicTable } from "dmt-core";
import { TComponentDocPartProps } from "../types";
import { extractParameterInfo } from "../utils";

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

  const parameters = typeDoc.signatures[0].parameters || []
  parameters.forEach((parameter: any, index: number) => {
    if (parameter.type.type === 'reference') {
      const reference = typeDocs.children.find((child: any) => child.id === parameter.type.id)
      reference.children.forEach((child: any, _index: number) => {
        let parameterInfo = extractParameterInfo(child)
        let row: TTableRow = {
          _id: `${_index}`,
          name: `${parameter.name}.${child.name}`,
          ...parameterInfo,
        }
        rows.push(row)
      })
    } else {
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
      <DynamicTable columns={columns} rows={rows} />
    </>
  )
};
