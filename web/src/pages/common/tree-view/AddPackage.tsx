import React from 'react'
// @ts-ignore
import ReactTooltip from 'react-tooltip'

import { Datasource } from '../../../api/Api'
import { FaPlus } from 'react-icons/fa'

interface Props {
  datasource: Datasource
}

export default (props: Props) => {
  return (
    <div style={{ margin: 'auto' }}>
      <ReactTooltip place={'bottom'} />
      <FaPlus
        data-tip={'Add a package'}
        onClick={() => {
          console.log('Clicked')
        }}
      />
    </div>
  )
}
