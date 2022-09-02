import React from "react";
import { DynamicTable } from "dmt-core";
import { TComponentDocPartProps } from "../types";

const columns: Array<string> = ["Name", "Type", "Optional", "Description"];

type TTableRow = {
  _id?: string;
  name: string;
  type: string;
  optional: string;
  description: string;
};

type TParameterInfo = {
  id: number,
  name: string,
  kindString: string,
  flags: {
    isOptional?: boolean
    [key: string]: any,
  },
  type: {
    type: string,
    name: string,
    declaration?: {
      signatures?: any[]
    }
  },
  comment?: any,
  [key: string]: any
}

const extractParameterInfo = (parameter: TParameterInfo) => {
  let type: string
  let description: string
  let optional: string = parameter.flags?.isOptional ? "True" : "False"
  if (parameter.type.declaration) {
    type = parameter.type.declaration.signatures[0].type.name
    description = parameter.type.declaration.signatures[0].comment?.summary[0]?.text
  } else {
    type = parameter.type.name
    description = parameter.comment?.summary[0]?.text
  }
  return { type, optional, description }
}

export const Parameters = (props: TComponentDocPartProps) => {
  const { typeDoc, typeDocs } = props;
  const title: JSX.Element = <h2>Parameters</h2>
  const rows: Array<TTableRow> = [];

  const properties = typeDoc.signatures[0].parameters;
  properties.forEach((property: any, index: number) => {
    if (property.type.type === 'reference') {
      const reference = typeDocs.children.find((child: any) => child.id === property.type.id)
      reference.children.forEach((child: any, _index: number) => {
        let parameterInfo = extractParameterInfo(child)
        let row: TTableRow = {
          _id: `${_index}`,
          name: child.name,
          ...parameterInfo,
        }
        rows.push(row)
      })
    } else {
      let parameterInfo = extractParameterInfo(property)
      let row: TTableRow = {
        _id: `${index}`,
        name: property.name,
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
