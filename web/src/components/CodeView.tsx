import { Pre } from '../plugins/preview/PreviewPlugin'
import React from 'react'

const PreviewView = ({ data, style }: any) => {
  return <Pre style={style}>{JSON.stringify(data, null, 2)}</Pre>
}
export default PreviewView
