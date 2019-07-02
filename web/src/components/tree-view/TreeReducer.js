import values from "lodash/values";
import keyBy from "lodash/keyBy";

/**
 * Using a flat state.
 * Example:
 * {
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
		}
  }
 *
 */

const defaultMatcher = (filterText, node) => {
  return (
    node && node.path.toLowerCase().indexOf(filterText.toLowerCase()) !== -1
  );
};

const nodeMatchesOrHasMatchingDescendants = (data, node, filter, matcher) => {
  return (
    matcher(filter, node) || // i match
    (node &&
    node.children && // or i have decendents and one of them match
      node.children.length &&
      !!node.children.find(childNode =>
        nodeMatchesOrHasMatchingDescendants(
          data,
          data[childNode],
          filter,
          matcher
        )
      ))
  );
};

const expandNodesWithMatchingDescendants = (
  data,
  nodes,
  filter,
  matcher = defaultMatcher
) => {
  return nodes.map(node => {
    let isOpen = false;
    if (node.children && node.children.length) {
      let childrenWithMatches = node.children.filter(child =>
        nodeMatchesOrHasMatchingDescendants(data, data[child], filter, matcher)
      );
      isOpen = !!childrenWithMatches.length; // i expand if any of my kids match
    }
    return Object.assign({}, node, { isOpen: isOpen });
  });
};

const hideNodesWithNoMatchingDescendants = (
  data,
  filter,
  matcher = defaultMatcher
) => {
  return values(data).map(node => {
    if (matcher(filter, node)) {
      return Object.assign({}, node, { isHidden: false });
    } else {
      //if not then only keep the ones that match or have matching descendants
      if (node.children) {
        let filteredChildren = node.children.filter(child =>
          nodeMatchesOrHasMatchingDescendants(
            data,
            data[child],
            filter,
            matcher
          )
        );
        if (filteredChildren && filteredChildren.length) {
          return Object.assign({}, node, { isHidden: false });
        }
      }
      return Object.assign({}, node, { isHidden: true });
    }
  });
};

const ADD_ROOT_PACKAGE = "ADD_ROOT_PACKAGE";
const ADD_PACKAGE = "ADD_PACKAGE";
const ADD_FILE = "ADD_FILE";
const TOGGLE_NODE = "TOGGLE_NODE";
const FILTER_TREE = "FILTER_TREE";

export const Actions = {
  filterTree: filter => ({
    type: FILTER_TREE,
    filter: filter
  }),
  addRootPackage: path => ({
    type: ADD_ROOT_PACKAGE,
    node: {
      path,
      type: "folder",
      isRoot: true,
      children: []
    }
  }),
  addPackage: (rootPath, name) => ({
    type: ADD_PACKAGE,
    rootPath,
    node: {
      path: `${rootPath}/${name}`,
      type: "folder",
      isRoot: false,
      children: []
    }
  }),
  addFile: (rootPath, name, content) => ({
    type: ADD_FILE,
    rootPath,
    node: {
      path: `${rootPath}/${name}`,
      type: "file",
      content,
      children: []
    }
  }),
  toggleNode: path => ({
    type: TOGGLE_NODE,
    path
  })
};

export default (state, action) => {
  switch (action.type) {
    case FILTER_TREE:
      let filteredNodes = hideNodesWithNoMatchingDescendants(
        state,
        action.filter
      );
      let expandedNodes = expandNodesWithMatchingDescendants(
        state,
        filteredNodes,
        action.filter
      );
      let nodesAsObject = keyBy(expandedNodes, "path");
      return { ...nodesAsObject };
    case ADD_ROOT_PACKAGE:
      return { ...state, [action.node.path]: action.node };

    case ADD_PACKAGE:
    case ADD_FILE:
      state[action.rootPath].children.push(action.node.path);
      return { ...state, [action.node.path]: action.node };

    case TOGGLE_NODE:
      const newState = { ...state };
      newState[action.path].isOpen = !newState[action.path].isOpen;
      return newState;

    default:
      return state;
  }
};
