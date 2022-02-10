import { DmssAPI } from '../services'
import React, { useContext, useRef, useState } from 'react'
import { AuthContext } from '../index'
import { Button } from '@equinor/eds-core-react'

export const addToPath = (
  body: any,
  token: string,
  files: File[] | undefined[] = [],
  dataSourceId: string,
  // TODO: Create a selector for upload target
  directory: string = 'Data/STasks'
): Promise<string> => {
  // @ts-ignore
  const dmssAPI = new DmssAPI(token)

  return dmssAPI.generatedDmssApi
    .explorerAddToPath({
      dataSourceId: dataSourceId,
      document: JSON.stringify(body),
      // TODO: Create a selector for upload target
      directory: directory,
      // @ts-ignore
      files: files.filter((item: any) => item !== undefined),
    })
    .then((uuid: string) => JSON.parse(uuid).uid)
    .catch((error: any) => {
      return error.json().then((response: any) => {
        throw response.message || response.detail || JSON.stringify(response)
      })
    })
}

// fileSuffix - A list of strings with allowed file suffixes without '.'. For example to allow yaml uploads; ['yaml', 'yml']
// getBody - A callback function to get the body of the document where file (Blob) should be created in.
// onUpload - Function to call when the document has been created on the server. Sends the new document's reference as an argument
export function UploadFileButton(props: {
  fileSuffix: string[]
  getBody: Function
  dataSourceId: string
  onUpload: Function
}) {
  const { fileSuffix, getBody, dataSourceId, onUpload } = props
  const textInput = useRef<HTMLInputElement>(null)
  const [fileName, setFileName] = useState<string>()
  const [error, setError] = useState<string>()
  // @ts-ignore
  const { token } = useContext(AuthContext)

  function handleUpload(event: any): void {
    setError('')
    const file = event.target.files[0]
    setFileName(file.name)
    const suffix = file.name.split('.')[file.name.split('.').length - 1]
    if (!fileSuffix.includes(suffix)) {
      setError(`Only files of type '${fileSuffix}' can be uploaded here`)
    } else {
      const newDocumentBody = getBody(file.name)
      addToPath(newDocumentBody, token, [file], dataSourceId)
        .then((createdUUID: any) =>
          onUpload({
            _id: createdUUID,
            name: newDocumentBody.name,
            type: newDocumentBody.type,
          })
        )
        .catch((error: any) => setError(error))
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* We want to upload files via a custom button instead of the default html <input> element.
        Therefore, we create a ref for the <input> and make clicks on the <Button>
        triggers clicks on that hidden <input> element.
      */}
      <input
        type="file"
        ref={textInput}
        accept={fileSuffix.map((a: string) => '.' + a).join(',')}
        style={{ display: 'none' }}
        onChange={(event: any) => handleUpload(event)}
      />
      <Button
        onClick={() => textInput?.current?.click()}
        style={{ margin: '0 10px' }}
      >
        Upload
      </Button>
      {fileName && (
        <div>
          Selected: <i>{fileName || 'None...'}</i>
        </div>
      )}
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </div>
  )
}
