import { TParameterInfo } from "./types";

export const findBlockByTag = (tag: string, typeDoc: any): any => {
  return typeDoc.signatures[0]?.comment?.blockTags.find(
    (child: any) => child.tag === tag
  );
};

export const extractParameterInfo = (parameter: TParameterInfo) => {
  let type: string
  let description: string
  let optional: string = parameter.flags?.isOptional ? "True" : "False"
  if (parameter.type.declaration) {
    type = parameter.type.declaration.signatures[0].type.name
    description = parameter.type.declaration.signatures[0].comment?.summary[0]?.text
  } else {
    type = parameter.type.name
    description = parameter.comment?.summary[0]?.text
  }
  return { type, optional, description }
}
