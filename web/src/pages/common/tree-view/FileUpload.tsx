import React from 'react'
import { DocumentsState } from '../DocumentReducer'
import { Datasource, IndexApi, IndexRequestBody } from '../../../api/Api'

const api = new IndexApi()

type Props = {
  state: DocumentsState
  dispatch: (action: any) => void
  datasource: Datasource
}

export default (props: Props) => {
  const { datasource } = props

  function handleFile(file: File, index: IndexRequestBody[], numFiles: number) {
    let fileReader: FileReader
    fileReader = new FileReader()
    fileReader.onloadend = () => {
      const content: string | ArrayBuffer | null = fileReader.result
      if (typeof content === 'string') {
        //@ts-ignore
        const relativePath = file.webkitRelativePath
        const path = `blueprints/${relativePath}`
        const json = JSON.parse(content)
        const indexItem = {
          id: path,
          content: json,
        }
        index.push(indexItem)

        //hack to deal with async behavior fileReader.
        if (index.length === numFiles) {
          api.post({ datasource, index })
        }
      }
    }
    fileReader.readAsText(file)
  }

  const handleFiles = (e: any) => {
    const files: any = e.target.files
    const index: IndexRequestBody[] = []
    for (let i = 0; i < files.length; i++) {
      //@todo use generateTreeview to validate the uploaded files.
      handleFile(files[i], index, files.length)
    }
  }

  return (
    <div style={{ margin: 'auto' }}>
      <div style={{ fontWeight: 700 }}>Upload blueprints at root: </div>
      <div>
        {
          //@ts-ignore
          <input
            type="file"
            webkitdirectory="true"
            mozdirectory="true"
            directory="true"
            onChange={handleFiles}
          />
        }
      </div>
    </div>
  )
}
