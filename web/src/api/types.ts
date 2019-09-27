export enum NodeType {
  rootPackage = 'root-package',
  subPackage = 'subpackage',
  file = 'file',
  datasource = 'datasource',
  folder = 'folder',
  version = 'version',

  // a file that doesn't exist. The node should do a create file onClick and then a fetchDocument. Or ideally, a custom endpoint.
  fileRef = 'file-ref',
  // a file which can have children, e.g instance of a nested blueprint.
  entityFile = 'entity-file',
  documentRef = 'document-ref',
  ARRAY_PLACEHOLDER = 'array-placeholder',
}
