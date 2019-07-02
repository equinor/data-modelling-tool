import React, { useReducer } from 'react';
import values from 'lodash/values';
import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';
import treeReducer, {Actions} from "./tree-view/TreeReducer";

/*
https://medium.com/@davidtranwd/implement-tree-view-component-with-reactjs-and-styled-components-5eea3b1603cf
*/
const getRootNodes = (nodes) => {
  return values(nodes).filter(node => node.isRoot === true);
};


var defaultMatcher = (filterText, node) => {
  return node && node.path.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
}

var nodeMatchesOrHasMatchingDescendants = (data, node, filter, matcher) => {
  return matcher(filter, node) || // i match
    (node && node.children && // or i have decendents and one of them match
      node.children.length &&
      !!node.children.find(childNode => nodeMatchesOrHasMatchingDescendants(data, data[childNode], filter, matcher)))
}

var expandNodesWithMatchingDescendants = (data, nodes, filter, matcher = defaultMatcher) => {
  let tmp = nodes.map(node => {
    let isOpen = false;
    if (node.children && node.children.length) {
      var childrenWithMatches = node.children.filter(child => nodeMatchesOrHasMatchingDescendants(data, node, filter, matcher))
      isOpen = !!childrenWithMatches.length // i expand if any of my kids match
    }
    return Object.assign({}, node, { isOpen: isOpen })
  });

  return tmp;
}

const filterTree = (data, filter, matcher = defaultMatcher) => {
  return values(data).filter(node => {
    if (matcher(filter, node)) {
      return true
    } else { //if not then only keep the ones that match or have matching descendants
      if (node.children) {
        let filteredChildren = node.children.filter(child => nodeMatchesOrHasMatchingDescendants(data, data[child], filter, matcher));
        if (filteredChildren && filteredChildren.length) {
          return true;
        }
      }
      return false;
    }
  });
}

function Tree(props) {
  const { data, onSelect } = props;
  const [ nodes, dispatch] = useReducer(treeReducer, data);

  const onNodeSelect = node => {
    onSelect(node);
  };

  const getChildNodes = (node) => {
    if (!node.children) return [];
    return node.children.map(path => nodes[path]);
  };

  const onToggle = (node) => {
    dispatch(Actions.toggleNode(node.path));
  };

  const addRootPackage = () => {
    let name = prompt("Please enter name of new package", "New Package");
    const newRootPath = `/${name}`;
    dispatch(Actions.addRootPackage(newRootPath));
  };

  const addPackage = (node) => {
    let name = prompt("Please enter name of new sub package", "subpackage");
    dispatch(Actions.addPackage(node.path, name));
  };

  const addFile = (node) => {
    let name = prompt("Please enter name of new file", "newfile");
    const content = 'this is a awesome new file';
    dispatch(Actions.addFile(node.path, name, content));
  };

  const rootNodes = getRootNodes(nodes);
  const handleFilterMouseUp = (e) => {
    const filter = e.target.value.trim();

    if (filter) {
      let filteredNodes = filterTree(nodes.nodes, filter);
      let expandedNodes = expandNodesWithMatchingDescendants(nodes.nodes, filteredNodes, filter)
      let nodesAsObject = keyBy(expandedNodes, 'path');
      setNodes({ nodes: nodesAsObject })
    } else {
      setNodes({ nodes: data })
    }
  }

  const rootNodes = getRootNodes(nodes.nodes);

  return (
    <div>
      <div>
        <button onClick={() => addRootPackage()}>New Package</button>
      </div>
      { rootNodes.map(node => (
        <TreeNode
          key={node.path}
          node={node}
          getChildNodes={getChildNodes}
          onToggle={onToggle}
          addPackage={addPackage}
          addFile={addFile}
          onNodeSelect={onNodeSelect}
        />
      ))}
    </div>
  )
}

Tree.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default Tree;
