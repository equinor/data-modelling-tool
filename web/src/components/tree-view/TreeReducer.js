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

const ADD_ROOT_PACKAGE = 'ADD_ROOT_PACKAGE';
const ADD_PACKAGE = 'ADD_PACKAGE';
const ADD_FILE = 'ADD_FILE';
const TOGGLE_NODE = 'TOGGLE_NODE';

export const Actions = {
	addRootPackage: (path) => ({
			type: ADD_ROOT_PACKAGE,
			node: {
				path,
				type: 'folder',
				isRoot: true,
				children: [],
			}
		}
	),
	addPackage: (rootPath, name) => ({
		type: ADD_PACKAGE,
		rootPath,
		node: {
			path: `${rootPath}/${name}`,
			type: 'folder',
			isRoot: false,
			children: []
		}
	}),
	addFile: (rootPath, name, content) => ({
		type: ADD_FILE,
		rootPath,
		node: {
			path: `${rootPath}/${name}`,
			type: 'file',
			content,
			children: [],
		}
	}),
	toggleNode: (path) => ({
		type: TOGGLE_NODE,
		path,
	})
};

export default (state, action) => {
	switch (action.type) {
		case ADD_ROOT_PACKAGE:
			return {...state, [action.node.path]: action.node};
			
		case ADD_PACKAGE:
		case ADD_FILE:
			state[action.rootPath].children.push(action.node.path);
			return {...state, [action.node.path]: action.node};
		
		case TOGGLE_NODE:
			const newState = {...state};
			newState[action.path].isOpen = !newState[action.path].isOpen;
			return newState;
			
		default:
			return state;
	}
}