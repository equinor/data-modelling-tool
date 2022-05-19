import React, { useEffect, useState } from 'react'
import { FaRegFileAlt } from 'react-icons/fa'
// @ts-ignore
import { Link } from 'react-router-dom'
import { Pre, TAttribute } from '@dmt/common'
type SimplifiedTreeProps = {
  datasourceId: string
  document: any
}

export const SimplifiedTree = (props: SimplifiedTreeProps) => {
  const { document, datasourceId } = props
  const [complexTypes, setComplexTypes] = useState<any[]>([])

  useEffect(() => {
    if (!document) return
    let path = document.type.split('/')
    path.shift()
    let complexTypes = getComplexTypesInDocument(document)
    setComplexTypes(complexTypes)
  }, [document])

  const getComplexTypesInDocument = (document: any) => {
    let complexTypes: TAttribute[] = []
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
    <Pre style={{ width: '50%' }}>
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
    </Pre>
  )
}
