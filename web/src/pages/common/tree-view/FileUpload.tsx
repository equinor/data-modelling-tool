import React, { useState } from 'react'
//@ts-ignore
import { NotificationManager } from 'react-notifications'
import { IndexRequestBody } from '../../../api/Api'
import Api2 from '../../../api/Api2'
import Modal from '../../../components/modal/Modal'
import { FaUpload } from 'react-icons/fa'
import { AddNode } from './DocumentTree'
import { NodeType } from '../../../api/types'
import { TreeNodeBuilder } from './TreeNodeBuilderOld'

type Props = {
  datasource: string
  addNode: AddNode
}

interface Node {
  id: string
  title: string
  nodeType: NodeType
  children: string[]
}

export default (props: Props) => {
  const { datasource, addNode } = props
  const [open, setOpen] = useState(false)

  function handleFile(file: File, index: IndexRequestBody[], numFiles: number) {
    let fileReader: FileReader
    fileReader = new FileReader()
    fileReader.onloadend = () => {
      const content: string | ArrayBuffer | null = fileReader.result
      if (typeof content === 'string') {
        //@ts-ignore
        const relativePath = file.webkitRelativePath
        const path = `${relativePath}`
        const json = JSON.parse(content)
        const indexItem = {
          path,
          ...json,
        }
        index.push(indexItem)

        const onSuccess = (newIndex: { [id: string]: Node }) => {
          function addNodes(node: Node | undefined, parent: string) {
            if (!node) return
            const treeNode = new TreeNodeBuilder({
              ...node,
              filename: node.title,
            })
              .setOpen(false)
              .build()
            addNode(treeNode, parent)
            node.children.forEach(id => {
              addNodes(newIndex[id], node.id)
            })
          }

          NotificationManager.success('', `Uploaded ${numFiles} files.`)
          setOpen(false)
          const packageName = index
            .map(({ path }) => path)
            .reduce((prev: string, path: string): string => {
              // FIXME: Shortcut; assuming all paths starts with the same name
              return path.split('/')[0]
            }, '')
          // index.map(({path, filename}: { path: string, filename: string}) => {
          //   const candidates: Node[] = Object.values(newIndex)
          //       .filter((item) => (item as { title: string }).title === filename)
          //   return candidates.length === 1
          //   ? candidates.pop()
          //       : candidates[0] // TODO
          //   // @ts-ignore
          // }).forEach((node: Node) => {
          //   const treeNode = new TreeNodeBuilder({...node, filename: node.title })
          //       .build()
          //   const parent = Object.values(newIndex)
          //       .find(parent => parent.children.includes(node.id))
          //   addNode(treeNode, parent ? parent.id : datasource)
          // })

          const _package = newIndex[datasource].children
            .map((id: string) => newIndex[id])
            .find(({ title }: { title: string }) => title === packageName)
          addNodes(_package, datasource)
          // setDocuments(index)
        }
        //hack to deal with async behavior fileReader.
        if (index.length === numFiles) {
          Api2.uploadPackageToRoot({
            dataSourceId: datasource,
            files: index,
            onSuccess,
          })
        }
      }
    }
    fileReader.readAsText(file)
  }

  const handleFiles = (e: any) => {
    const files: any = e.target.files
    const index: IndexRequestBody[] = []
    for (let i = 0; i < files.length; i++) {
      handleFile(files[i], index, files.length)
    }
  }

  return (
    <div>
      <FaUpload
        onClick={() => {
          setOpen(true)
        }}
      />
      <Modal open={open} toggle={() => setOpen(!open)}>
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
      </Modal>
    </div>
  )
}
