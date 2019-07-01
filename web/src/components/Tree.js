import React, { useState } from 'react';
import values from 'lodash/values';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

/*
https://medium.com/@davidtranwd/implement-tree-view-component-with-reactjs-and-styled-components-5eea3b1603cf
*/

function Tree(props) {
  const { data, onSelect } = props;
  const [ nodes, setNodes ] = useState({nodes: data});

  const onNodeSelect = node => {
    onSelect(node);
  }

  const getRootNodes = () => {
    return values(nodes.nodes).filter(node => node.isRoot === true);
  }
  
  const getChildNodes = (node) => {
    if (!node.children) return [];
    return node.children.map(path => nodes.nodes[path]);
  }  
  
  const onToggle = (node) => {
    nodes.nodes[node.path].isOpen = !node.isOpen;
    setNodes({nodes: nodes.nodes});
  } 

  const addRootPackage = () => {
    let name = prompt("Please enter name of new package", "New Package");

    nodes.nodes[`/${name}`] = {
      path: `/${name}`,
      type: 'folder',
      children: [],
      isRoot: true,
    }
    setNodes({nodes: nodes.nodes});
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
    setNodes({nodes: nodes.nodes});
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
    setNodes({nodes: nodes.nodes});
  };

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