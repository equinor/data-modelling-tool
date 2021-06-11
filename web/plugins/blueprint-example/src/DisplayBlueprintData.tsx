import React from 'react'

type DisplayBlueprintDataProps = {
  document: any
}

export default (props: DisplayBlueprintDataProps) => {
  const { document } = props

  const getDocumentAttribute = (attributeName: string) => {
    let attribute: any
    if (document[attributeName]) {
      return document[attributeName]
    } else {
      throw new Error(
        `Tried to access an attribute that does not exist on document`
      )
    }
  }

  return (
    <div>
      <div>Some information extracted from the blueprint:</div>
      <div>Blueprint attributes names:</div>
      {getDocumentAttribute('attributes').map((attribute: any) => {
        return <div>- {attribute.name}</div>
      })}
      <div style={{ marginTop: '25px' }}>Blueprint id: {document._id} </div>
      <div style={{ marginTop: '25px' }}>
        Does the blueprint have any storage recipes?{' '}
        {getDocumentAttribute('storageRecipes').length > 0 ? 'Yes' : 'No'}
      </div>{' '}
      {}
    </div>
  )
}
