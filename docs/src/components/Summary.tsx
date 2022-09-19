import React from "react";
import { TComponentDocPartProps } from '../types'

export const Summary = (props: TComponentDocPartProps) => {
  const { typeDoc } = props;

  const comment = typeDoc.comment ?? typeDoc.signatures[0]?.comment ?? {}

  const summary = comment.summary[0]?.text ?? ''
  return <div>{summary}</div>
};
