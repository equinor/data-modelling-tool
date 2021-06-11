import React, { useState } from 'react'

type EditDocumentDescriptionProps = {
  updateDocument: (document: any) => void
  document: any
}

export default (props: EditDocumentDescriptionProps) => {
  let { updateDocument, document } = props
  const [description, setDescription] = useState(document.description)
  const updateDescriptionInDocument = () => {
    document = { ...document, description: description }
    updateDocument(document)
  }

  return (
    <div>
      <div style={{ marginTop: '25px' }}>
        Current blueprint description: {document.description}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ margin: '10px 0' }}>
          <label style={{ marginRight: '10px' }}>New description: </label>
          <input
            disabled={false}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            style={{ width: '280px' }}
          />
          <button onClick={updateDescriptionInDocument}>Submit</button>
        </div>
      </div>
    </div>
  )
}
