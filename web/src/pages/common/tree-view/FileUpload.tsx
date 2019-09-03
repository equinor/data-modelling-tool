import React from 'react'
import { DocumentsState } from '../DocumentReducer'

type IndexItem = {
  _id: string
  title: string
}

type Props = {
  state: DocumentsState
  dispatch: (action: any) => void
}

export default (props: Props) => {
  // const { dispatch } = props

  function handleFile(file: File, index: any[], numFiles: number) {
    let fileReader: FileReader
    fileReader = new FileReader()
    fileReader.onloadend = () => {
      const content: string | ArrayBuffer | null = fileReader.result
      if (typeof content === 'string') {
        //@ts-ignore
        const relativePath = file.webkitRelativePath
        const indexOfCurrent = relativePath.indexOf('/')
        const path = relativePath.substring(indexOfCurrent + 1)
        // const url = state.dataUrl + path
        const json = JSON.parse(content)
        const indexItem = {
          _id: path,
          title: json.title,
        }
        index.push(indexItem)

        console.log(path, json)

        //hack to deal with async behavior fileReader.
        if (index.length === numFiles) {
          console.log('dispatch: ', index)
          // dispatch(DocumentActions.setSelectedDataSourceId(path))
        }
        // if (postToApi) {
        //   axios
        //     .put(url, JSON.parse(content))
        //     .then(res => {
        //       //@todo update treeview.
        //       console.log('added to db: ', res)
        //     })
        //     .catch(e => {
        //       console.log(e)
        //     })
        // }
      }
    }
    fileReader.readAsText(file)
  }

  const handleFiles = (e: any) => {
    const files: any = e.target.files
    const index: IndexItem[] = []
    for (let i = 0; i < files.length; i++) {
      //@todo use generateTreeview to validate the uploaded files.
      handleFile(files[i], index, files.length)
    }
  }

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>
        Upload blueprints at root:{' '}
      </div>
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
