import React from 'react'
import axios from 'axios'
import { BlueprintState } from '../BlueprintReducer'

type IndexItem = {
  _id: string
  title: string
}

type Props = {
  state: BlueprintState
}

export default (props: Props) => {
  const { state } = props

  const handleFile = (file: File, index: IndexItem[], postToApi: boolean) => {
    let fileReader: FileReader
    fileReader = new FileReader()
    fileReader.onloadend = () => {
      const content: string | ArrayBuffer | null = fileReader.result
      if (typeof content === 'string') {
        //@ts-ignore
        const relativePath = file.webkitRelativePath
        const indexOfCurrent = relativePath.indexOf('/')
        const path = relativePath.substring(indexOfCurrent + 1)
        const url = state.dataUrl + path

        if (postToApi) {
          axios
            .put(url, JSON.parse(content))
            .then(res => {
              //@todo update treeview.
              console.log('added to db: ', res)
            })
            .catch(e => {
              console.log(e)
            })
        }
      }
    }
    fileReader.readAsText(file)
  }

  const handleFiles = (e: any) => {
    const files: any = e.target.files
    const index: IndexItem[] = []
    const postToApi: boolean = window.confirm(
      'Warning. Uploading wrong files or wrong relative path will mess up the structure of blueprints. Proceed with caution.'
    )
    for (let i = 0; i < files.length; i++) {
      //@todo use generateTreeview to validate the uploaded files.
      handleFile(files[i], index, postToApi)
    }
  }

  return (
    <div>
      <div style={{ fontWeight: 700, marginBottom: 10 }}>
        Upload blueprints at root:{' '}
      </div>
      <div>
        <input
          type="file"
          webkitdirectory="true"
          mozdirectory="true"
          directory="true"
          onChange={handleFiles}
        />
      </div>
    </div>
  )
}
