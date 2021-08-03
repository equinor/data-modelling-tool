import React, { useEffect, useState } from 'react'
import { FaDatabase, FaFolderOpen, FaRegFileAlt } from 'react-icons/fa'
import { DocumentAPI } from '@dmt/common'
import { BlueprintAttribute } from '../domain/BlueprintAttribute'
import { BlueprintAttributeType } from '../domain/types'
import { PackageObject } from '../pages/ViewPage'

type SimplifiedTreeProps = {
  packages: PackageObject[]
  datasourceId: string
  document: any
}

const documentAPI = new DocumentAPI()

export const SimplifiedTree = (props: SimplifiedTreeProps) => {
  const { packages, datasourceId, document } = props
  const [complexTypes, setComplexTypes] = useState<BlueprintAttribute[]>([])

  useEffect(() => {
    let path = document.type.split('/')
    path.shift()
    documentAPI
      .getByPath(datasourceId, path.join('/'))
      .then((response: any) => {
        const complexTypes = getComplexTypes(response)
        setComplexTypes(complexTypes)
      })
  }, [])

  const getComplexTypes = (blueprint: any) => {
    /* Get a list of complex types defined in the blueprint*/
    let complexTypes: BlueprintAttribute[] = []
    if (Object.keys(blueprint).length !== 0) {
      const attributes: BlueprintAttributeType[] = blueprint['attributes']
      for (const key in attributes) {
        let attr = new BlueprintAttribute(attributes[key])
        if (!attr.isPrimitive()) {
          complexTypes.push(attr)
        }
      }
    }
    return complexTypes
  }

  const PADDING_TOP: number = 10
  const PADDING_LEFT: number = 20

  return (
    <div>
      <div>
        <FaDatabase style={{ color: 'gray' }} /> {datasourceId}
      </div>
      {packages.map((package_: PackageObject, index: number) => {
        return (
          <div
            style={{
              paddingLeft: PADDING_LEFT * (index + 1),
              paddingTop: PADDING_TOP,
            }}
          >
            {package_.is_root ? (
              <FaFolderOpen style={{ color: '#8531A3' }} />
            ) : (
              <FaFolderOpen />
            )}
            {package_.package_name}
          </div>
        )
      })}
      <div
        style={{
          paddingLeft: PADDING_LEFT * (packages.length + 1),
          paddingTop: PADDING_TOP,
          paddingBottom: PADDING_LEFT,
        }}
      >
        <FaRegFileAlt /> {document['name']}
        {complexTypes.length > 0 && (
          <div>
            {complexTypes.map((type) => (
              <div
                style={{ paddingLeft: PADDING_LEFT, paddingTop: PADDING_TOP }}
              >
                <FaRegFileAlt /> {type.getName()}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
