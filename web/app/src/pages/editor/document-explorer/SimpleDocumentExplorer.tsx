import React, {useContext, useEffect, useState} from 'react'
import {
  ApplicationContext, DocumentAPI,
  NodeType,
  Tree,
  TreeNodeRenderProps,
} from '@dmt/common'
import { DocumentNode } from './DocumentNode'

import { useModalContext } from '../../../context/modal/ModalContext'
import useExplorer from '../../../hooks/useExplorer'
import useRunnable, { ActionTypes } from '../../../hooks/useRunnable'
import {
  IGlobalIndex,
  useGlobalIndex,
} from '../../../context/global-index/IndexProvider'

//@ts-ignore
import { NotificationManager } from 'react-notifications'
import axios from "axios";
import useLocalStorage from "../../../hooks/useLocalStorage";
import {SimplifiedTree} from "../../../components/SimplifiedTree";

const documentAPI = new DocumentAPI()

type SimpleDocumentExplorerProps = {
  document: any
}

export default (props: SimpleDocumentExplorerProps) => {
  const [packagesLoaded, setPackagesLoaded] = useState(false)
  const [packages, setPackages] = useState({})
  const [selectedDataSource, setSelectedDataSource] = useLocalStorage(
  'searchDatasource',
  ''
  )
  const index: IGlobalIndex = useGlobalIndex()
  const explorer = useExplorer({})
  const application = useContext(ApplicationContext)
    const documentId = props.document["_id"]
    const documentName = props.document["name"]

  useEffect(() => {

      console.log("run ")
        if (typeof selectedDataSource === "string" && props.document) {
        documentAPI.findPackage(selectedDataSource, documentId ).then((result) =>
        {
          setPackages(result)
        })
      }
      else if (typeof selectedDataSource !== "string") {
        throw new Error("you have not selected a datasource")
      }
      else if (!props.document) {
        throw new Error("props.document not correct")
      }
  }, [])




  if (Object.keys(packages).length === 0 || typeof selectedDataSource !== "string") return <div></div>
  return (
    <>
      <SimplifiedTree packages={packages} datasourceId={selectedDataSource} documentName={documentName} />
      {/*<Tree
        state= {index.models.index.models.tree.models.tree} //{fakeIndex2}
        operations={{}}
        dataSources={application?.visibleDataSources}
      >
        {(node: TreeNodeRenderProps) => {
          return (
              <DocumentNode
                onToggle={() => handleToggle(node)}
                onOpen={() => handleOpen(node)}
                node={node}
              />
          )
        }}
      </Tree>*/}

    </>
  )
}
