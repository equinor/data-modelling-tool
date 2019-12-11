import React from 'react'
import {Entity} from "../types";

type IndexItem = {
  path: string
  entity: Entity
}

const FileUploadWidget = (props: any) => {
  const {onChange} = props;
  function handleFile(file: File, index: IndexItem[], numFiles: number) {
    let fileReader: FileReader
    fileReader = new FileReader()
    fileReader.onloadend = () => {
      const content: string | ArrayBuffer | null = fileReader.result
      if (typeof content === 'string') {
        //@ts-ignore
        const relativePath = file.webkitRelativePath
        try {
          const json = JSON.parse(content)
          const indexItem = {
            path: relativePath,
            entity: json,
          }
          index.push(indexItem)

        } catch(err) {
          console.warn(err, content);
          alert(`The file ${relativePath} can't be parsed.`)
        }

        //hack to deal with async behavior fileReader.
        if (index.length === numFiles) {
          const indexStr = JSON.stringify(index)
          onChange(indexStr);
        }
      }
    }
    fileReader.readAsText(file)
  }

  const handleFiles = (e: any) => {
    const files: any = e.target.files
    const index: IndexItem[] = []
    for (let i = 0; i < files.length; i++) {
      handleFile(files[i], index, files.length)
    }
  }

  return (
    <div>
      <input
        type="file"
        //@ts-ignore
        webkitdirectory="true"
        mozdirectory="true"
        directory="true"
        onChange={handleFiles}
      />
      <div>
        The
      </div>
    </div>
  )
}

export default FileUploadWidget

