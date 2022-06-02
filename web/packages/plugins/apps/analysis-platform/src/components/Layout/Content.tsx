import React from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'

import { TContent } from '@dmt/common'
import { backgroundColorDefault, backgroundColorLight } from '../Design/Colors'

const { Content } = Layout

const PageContent = styled.div`
  padding: 20px;
  background-color: ${backgroundColorDefault};
`

export default (props: TContent): JSX.Element => {
  const { content } = props

  return (
    <Content style={{ margin: '0px 0px 10px 0px' }}>
      {/*@ts-ignore*/}
      <PageContent>{content({ settings: props.settings })}</PageContent>
    </Content>
  )
}
