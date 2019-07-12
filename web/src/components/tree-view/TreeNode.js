import React from 'react'
import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa'
import styled from 'styled-components'
import last from 'lodash/last'
import PropTypes from 'prop-types'
import ContextMenu from '../context-menu/ContextMenu'

const getPaddingLeft = (level, type) => {
  let paddingLeft = level * 20
  if (type === 'file') paddingLeft += 20
  return paddingLeft
}

//@todo fix hover when contextMenu is open. https://codepen.io/Iulius90/pen/oLaNoJ
const StyledTreeNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  padding-left: ${props => getPaddingLeft(props.level, props.type)}px;

  &:hover {
    background: lightgray;
  }
`

const NodeIcon = styled.div`
  font-size: 12px;
  margin-right: ${props => (props.marginRight ? props.marginRight : 5)}px;
`

const getNodeLabel = node => {
  //@todo use title in treeview?
  // if (node.title) {
  //   return node.title
  // }
  return last(node.path.split('/'))
}

const WithContextMenu = props => {
  const { id, label, menuItems } = props
  if (menuItems.length === 0) {
    return <span>{label}</span>
  }
  return (
    <ContextMenu id={id} menuItems={menuItems}>
      {label}
    </ContextMenu>
  )
}

const getChildNodes = (node, nodes) => {
  if (!node.children) return []
  return node.children.map(path => nodes[path])
}

const TreeNode = props => {
  const { node, nodes, level, onToggle, onNodeSelect, menuItems } = props

  return (
    <React.Fragment>
      <StyledTreeNode level={level} type={node.type}>
        <NodeIcon onClick={() => onToggle(node)}>
          {node.type === 'folder' &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={10}>
          {node.type === 'file' && <FaFile />}
          {node.type === 'folder' && node.isOpen === true && <FaFolderOpen />}
          {node.type === 'folder' && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <span role="button" onClick={() => onNodeSelect(node)}>
          <WithContextMenu
            id={node.path}
            menuItems={menuItems.filter(item => item.type === node.type)}
            label={getNodeLabel(node)}
          />
        </span>
      </StyledTreeNode>

      {node.isOpen &&
        getChildNodes(node, nodes)
          .filter(node => !node.isHidden)
          .map(childNode => (
            <TreeNode
              key={'treenode' + childNode.path}
              {...props}
              node={childNode}
              level={level + 1}
            />
          ))}
    </React.Fragment>
  )
}

TreeNode.propTypes = {
  node: PropTypes.object.isRequired,
  level: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onNodeSelect: PropTypes.func.isRequired,
}

TreeNode.defaultProps = {
  level: 0,
}

export default TreeNode
