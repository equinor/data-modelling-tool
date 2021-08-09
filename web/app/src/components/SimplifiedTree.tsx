import React, { useEffect, useState } from 'react'
import {  FaRegFileAlt } from 'react-icons/fa'
import { BlueprintAttribute } from '../domain/BlueprintAttribute'
// @ts-ignore
import { Link } from 'react-router-dom'

type SimplifiedTreeProps = {
  datasourceId: string
  document: any
}


export const SimplifiedTree = (props: SimplifiedTreeProps) => {
  const {document, datasourceId} = props
  const [complexTypes, setComplexTypes] = useState<any[]>([])


  useEffect(() => {
    let path = document.type.split('/')
    path.shift()
    let complexTypes = getComplexTypesInDocument(document)
    setComplexTypes(complexTypes)
  }, [])

  const getComplexTypesInDocument = (document: any) => {
    let complexTypes: BlueprintAttribute[] = []
    if (Object.keys(document).length !== 0) {
        console.log(document)
        for (const key in document) {
            //check if document attribute is an object, meaning that it's a complex type
            if (document[key].constructor == Object && "_id" in document[key]) {
                complexTypes.push(document[key])
            }
        }
    }
    return complexTypes
  }

  return (
    <div style={{borderStyle: "solid", borderWidth: "1px", borderColor: "lightgray", width: "50%", padding: "5px", marginTop: "5px", marginBottom: "5px",paddingTop: 10, paddingBottom: 10  }}>
        <FaRegFileAlt /> {document['name']}
        {complexTypes.length > 0 && (
          <div>
            {complexTypes.map((type) => (
              <Link target="_parent" to={`/view/${datasourceId}/${type["_id"]}`}>
                  <div style={{ paddingLeft: 20, paddingTop: 10, color: "black" }}>
                     <FaRegFileAlt /> {type["name"]}
                  </div>
              </Link>
            ))}
          </div>
        )}
    </div>
  )
}
