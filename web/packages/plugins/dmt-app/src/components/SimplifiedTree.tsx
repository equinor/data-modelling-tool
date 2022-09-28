import React, { useEffect, useState } from 'react'
import { FaRegFileAlt } from 'react-icons/fa'

import { Link } from 'react-router-dom'
import { TAttribute } from '@development-framework/dm-core'
type TSimplifiedTreeProps = {
  datasourceId: string
  document: any
}

export const SimplifiedTree = (props: TSimplifiedTreeProps) => {
  const { document, datasourceId } = props
  const [complexTypes, setComplexTypes] = useState<any[]>([])

  useEffect(() => {
    if (!document) return
    const path = document.type.split('/')
    path.shift()
    const complexTypes = getComplexTypesInDocument(document)
    setComplexTypes(complexTypes)
  }, [document])

  const getComplexTypesInDocument = (document: any) => {
    const complexTypes: TAttribute[] = []
    if (Object.keys(document).length !== 0) {
      for (const key in document) {
        //check if document attribute is an object, meaning that it's a complex type
        if (document[key].constructor == Object && '_id' in document[key]) {
          complexTypes.push(document[key])
        }
      }
    }
    return complexTypes
  }

  if (complexTypes.length === 0) return <div />
  return (
    <pre style={{ width: '50%' }}>
      <FaRegFileAlt /> {document['name']}
      <div>
        {complexTypes.map((type, index) => (
          <Link
            key={index}
            target="_parent"
            to={`/view/${datasourceId}/${type['_id']}`}
          >
            <div
              style={{
                paddingLeft: 20,
                paddingTop: 10,
                color: '#333',
                fontSize: '13px',
              }}
            >
              <FaRegFileAlt /> {type['name']}
            </div>
          </Link>
        ))}
      </div>
    </pre>
  )
}
