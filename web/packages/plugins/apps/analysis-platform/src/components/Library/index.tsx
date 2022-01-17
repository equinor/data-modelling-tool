import React from 'react'
import Stask from './Stask'
import { DmtSettings } from '../../Types'

const Library = (props: DmtSettings): JSX.Element => {
  const { settings } = props
  return (
    <>
      <Stask settings={settings} />
    </>
  )
}

export default Library
