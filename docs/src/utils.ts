import { TParameterInfo } from "./types";

export const findBlockByTag = (tag: string, typeDoc: any): any => {
  const comment = typeDoc.comment ?? typeDoc.signatures[0]?.comment ?? {}
  return comment?.blockTags.find(
    (child: any) => child.tag === tag
  );
};

export const extractParameterInfo = (parameter: TParameterInfo) => {
  let type: string
  let description: string
  let optional: string = parameter.flags?.isOptional ? "True" : "False"
  if (parameter.type.type === 'union') {
    type = parameter.type.types.map((type) => type.name).join(' | ')
    description = parameter.comment?.summary?.map((comment: { kind: string, text: string }) => comment.text).join() ?? ''
  } else if (parameter.type.declaration) {
    type = parameter.type.declaration.signatures[0].type.name
    description = parameter.type.declaration.signatures[0].comment?.summary[0]?.text
  } else {
    type = parameter.type.name ?? parameter.kindString
    description = parameter.comment?.summary[0]?.text
  }
  return { type, optional, description }
}

export const getParameters = (typeDoc: any) => {
  let parameters = []
  if (typeDoc.signatures && typeDoc.signatures.length >= 1) {
    // Functions
    return typeDoc.signatures[0].parameters
  } else if (typeDoc.type?.declaration?.children) {
    // Types
    return typeDoc.type.declaration.children
  } else if (typeDoc.children) {
    // Enums
    return typeDoc.children
  }
  return parameters
}
