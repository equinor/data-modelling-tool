import React from "react";
import { TComponentDocPartProps } from '../types'
import { findBlockByTag } from '../utils'

export const Returns = (props: TComponentDocPartProps) => {
  const { typeDoc } = props;
  const title: JSX.Element = <h2>Returns</h2>

  // Find the "@returns" block, if present
  const returnsBlock = findBlockByTag('@returns', typeDoc)
  if (!returnsBlock || returnsBlock.content?.length < 0) {
    return (
      <>
        {title}
        <p>No return value.</p>
      </>
    )
  }
  
  const returnsDescription = returnsBlock.content.map(
    (content: { kind: string, text: string }) => content.text).join('')
  return (
    <>
      {title}
      <div>{returnsDescription}</div>
    </>
  ) 

};
