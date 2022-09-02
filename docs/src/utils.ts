export const findBlockByTag = (tag: string, typeDoc: any): any => {
  return typeDoc.signatures[0].comment.blockTags.find(
    (child: any) => child.tag === tag
  );
};
