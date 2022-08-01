import { DmssAPI } from '../services'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { AuthContext } from '../index'
import { Button, Progress } from '@equinor/eds-core-react'
// @ts-ignore
import { NotificationManager } from 'react-notifications'
import { AxiosError } from 'axios'

export const addToPath = (
  body: any,
  token: string,
  files: File[] | undefined[] = [],
  dataSourceId: string,
  directory: string,
  updateUncontainer = false
): Promise<string> => {
  const dmssAPI = new DmssAPI(token)

  return dmssAPI
    .explorerAddToPath({
      dataSourceId: dataSourceId,
      document: JSON.stringify(body),
      directory: directory, // @ts-ignore
      files: files.filter((item: any) => item !== undefined),
      updateUncontained: updateUncontainer,
    })
    .then((response: any) => response.data.uid)
}

// fileSuffix - A list of strings with allowed file suffixes without '.'. For example to allow yaml uploads; ['yaml', 'yml']
// getBody - A callback function to get the body of the document where file (Blob) should be created in.
// onUpload - Function to call when the document has been created on the server. Sends the new document's reference as an argument
// formData - only used to clear 'error' state when the parent form using this component changes
export function UploadFileButton(props: {
  fileSuffix: string[]
  getBody: Function
  dataSourceId: string
  onUpload: Function
  formData: string
}) {
  const { fileSuffix, getBody, dataSourceId, onUpload, formData } = props
  const textInput = useRef<HTMLInputElement>(null)
  const [error, setError] = useState<string | undefined>()
  const [loading, setLoading] = useState<boolean>(false)
  const { token } = useContext(AuthContext)

  useEffect(() => setError(undefined), [formData])

  function handleUpload(event: any): void {
    setError('')
    const file = event.target.files[0]
    const suffix = file.name.split('.')[file.name.split('.').length - 1]
    if (!fileSuffix.includes(suffix)) {
      NotificationManager.error(
        `Only files of type '${fileSuffix}' can be uploaded here`
      )
    } else {
      const newDocumentBody = getBody(file.name)
      setLoading(true)
      addToPath(
        newDocumentBody,
        token,
        [file],
        dataSourceId,
        'Data/STasks',
        true
      )
        .then((createdUUID: any) =>
          onUpload({
            _id: createdUUID,
            name: newDocumentBody.name,
            type: newDocumentBody.type,
          })
        )
        .catch((error: AxiosError<any>) =>
          setError(error.response?.data?.message)
        )
        .finally(() => setLoading(false))
    }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'baseline' }}>
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
      {loading ? (
        <Button style={{ margin: '0 10px' }}>
          <Progress.Dots />
        </Button>
      ) : (
        <Button
          onClick={() => textInput?.current?.click()}
          style={{ margin: '0 10px' }}
        >
          Upload
        </Button>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}
