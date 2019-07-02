import React, { useState } from 'react';
import values from 'lodash/values';
import keyBy from 'lodash/keyBy';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

/*
https://medium.com/@davidtranwd/implement-tree-view-component-with-reactjs-and-styled-components-5eea3b1603cf
*/

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
  const [nodes, setNodes] = useState({ nodes: data });

  const onNodeSelect = node => {
    onSelect(node);
  }

  const getRootNodes = () => {
    return values(nodes.nodes).filter(node => node.isRoot === true);
  }

  const getChildNodes = (node) => {
    if (!node.children) return [];
    let values = node.children.filter(child => nodes.nodes[child]);
    return values.map(path => nodes.nodes[path]);
  }

  const onToggle = (node) => {
    let thisNode = nodes.nodes[node.path];
    if (thisNode && node) {
      thisNode.isOpen = !node.isOpen;
      nodes.nodes[node.path] = thisNode;
    }
    setNodes({ nodes: nodes.nodes });
  }

  const addRootPackage = () => {
    let name = prompt("Please enter name of new package", "New Package");

    nodes.nodes[`/${name}`] = {
      path: `/${name}`,
      type: 'folder',
      children: [],
      isRoot: true,
    }
    setNodes({ nodes: nodes.nodes });
  };

  const addPackage = (node) => {
    let name = prompt("Please enter name of new sub package", "subpackage");
    let path = `${node.path}/${name}`;

    nodes.nodes[path] = {
      path: path,
      type: 'folder',
      children: [],
    }

    nodes.nodes[node.path].children.push(path);
    setNodes({ nodes: nodes.nodes });
  };

  const addFile = (node) => {
    let name = prompt("Please enter name of new file", "newfile");
    let path = `${node.path}/${name}`;

    nodes.nodes[path] = {
      path: path,
      type: 'file',
      children: [],
      content: 'this is a awesome new file'
    }

    nodes.nodes[node.path].children.push(path);
    setNodes({ nodes: nodes.nodes });
  };

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
      <div>
        <input onKeyUp={handleFilterMouseUp} />
      </div>
      {rootNodes.map(node => {
        return (
          <TreeNode
            key={node.path}
            node={node}
            getChildNodes={getChildNodes}
            onToggle={onToggle}
            addPackage={addPackage}
            addFile={addFile}
            onNodeSelect={onNodeSelect}
          />
        )
      })}
    </div>
  )
}

Tree.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default Tree;