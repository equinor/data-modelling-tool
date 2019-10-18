import React, { useEffect, useState } from 'react'
import Tree from '../../../components/tree-view/Tree'
import { Datasource, IndexApi } from '../../../api/Api'
import { TreeNodeRenderProps } from '../../../components/tree-view/TreeNode'

const api = new IndexApi()

interface PropTypes {
  dataSources: Datasource[]
  render: Function
}

export default (props: PropTypes) => {
  const { dataSources, render } = props
  const [loading, setLoading] = useState(false)
  const [documents, setDocuments] = useState({})

  useEffect(() => {
    const getDataSource = async (dataSource: Datasource) => {
      return await api.get(dataSource)
    }
    const getAllDataSources = async () => {
      return await Promise.all(
        dataSources.map(dataSource => getDataSource(dataSource))
      )
    }
    setLoading(true)
    getAllDataSources().then(values => {
      const allDocuments = values.reduce((obj, item) => {
        return {
          ...obj,
          ...item,
        }
      }, {})
      setDocuments(allDocuments)
      setLoading(false)
    })
  }, [dataSources])

  if (loading) {
    return <div>Loading...</div>
  }
  if (!Object.keys(documents).length) {
    return null
  }

  return (
    <div>
      <div>
        <Tree tree={documents}>
          {(props: TreeNodeRenderProps) => {
            return render(props)
          }}
        </Tree>
      </div>
    </div>
  )
}
