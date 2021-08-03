import React from 'react'
import { FaDatabase, FaFolderOpen, FaRegFileAlt } from 'react-icons/fa'

type SimplifiedTreeProps = {
  packages: any
  datasourceId: string
  document: any
}

export const SimplifiedTree = (props: SimplifiedTreeProps) => {
  return (
    <div>
      <div>
        <FaDatabase style={{ color: 'gray' }} /> {props.datasourceId}
      </div>
      {props.packages.map((package_: any, index: number) => {
        return (
          <div style={{ paddingLeft: 20 * (index + 1), paddingTop: 10 }}>
            {' '}
            {package_.is_root ? (
              <FaFolderOpen style={{ color: '#8531A3' }} />
            ) : (
              <FaFolderOpen />
            )}{' '}
            {package_.package_name}
          </div>
        )
      })}
      <div
        style={{
          paddingLeft: 20 * (props.packages.length + 1),
          paddingTop: 10,
          paddingBottom: 20,
        }}
      >
        <FaRegFileAlt /> {props.document['name']}
      </div>
    </div>
  )
}
