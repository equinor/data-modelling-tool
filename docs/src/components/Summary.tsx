import React from "react";
import { TComponentDocPartProps } from '../types'

export const Summary = (props: TComponentDocPartProps) => {
  const { typeDoc } = props;
  
  const summary = typeDoc.signatures[0].comment.summary[0].text
  return <div>{summary}</div>
};
