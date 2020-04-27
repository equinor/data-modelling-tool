import { Pre } from '../plugins/preview/PreviewPlugin'
import React from 'react'

const PreviewView = ({ data }: any) => {
  return <Pre>{JSON.stringify(data, null, 2)}</Pre>
}
export default PreviewView
