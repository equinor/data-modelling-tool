import React, { useState } from 'react'
import styled from 'styled-components'
import Tree from './components/Tree'
import values from 'lodash/values'

const StyledFileExplorer = styled.div`
  width: 800px;
  max-width: 100%;
  margin: 0 auto;
  display: flex;
`

const TreeWrapper = styled.div`
  width: 250px;
`

const data = {
  '/root': {
    path: '/root',
    type: 'folder',
    isRoot: true,
    children: ['/root/subpackage'],
  },
  '/root/subpackage': {
    path: '/root/subpackage',
    type: 'folder',
    children: ['/root/subpackage/readme.md'],
  },
  '/root/subpackage/readme.md': {
    path: '/root/subpackage/readme.md',
    type: 'file',
    content: 'Thanks for reading me me. But there is nothing here.',
  },
  '/geometries': {
    path: '/geometries',
    type: 'folder',
    isRoot: true,
    children: ['/geometries/box'],
  },
  '/geometries/box': {
    path: '/geometries/box',
    type: 'folder',
    children: ['/geometries/box/box-blueprint.json'],
  },
  '/geometries/box/box-blueprint.json': {
    path: '/geometries/box/box-blueprint.json',
    type: 'file',
    content: 'this is a box',
  },
}

function FileExplorer(props) {
  const [selectedFile, setSelectedFile] = useState(null)

  return (
    <StyledFileExplorer>
      <TreeWrapper>
        <Tree data={data} onSelect={setSelectedFile} />
      </TreeWrapper>
      <div>
        {selectedFile && selectedFile.type === 'file' && selectedFile.content}
      </div>
    </StyledFileExplorer>
  )
}

export default FileExplorer
