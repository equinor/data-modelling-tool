import React from 'react'
import { Layout } from 'antd'
import styled from 'styled-components'

import { TContent } from '../../Types'
import { backgroundColorDefault, backgroundColorLight } from '../Design/Colors'
import { Heading } from '../Design/Fonts'

const { Content } = Layout

const PageHeading = styled.div`
  padding: 20px;
  background-color: ${backgroundColorLight};
`

const PageContent = styled.div`
  padding: 20px;
  background-color: ${backgroundColorDefault};
`

export default (props: TContent): JSX.Element => {
  const { heading, content } = props

  return (
    <Content style={{ margin: '0px 0px 10px 0px' }}>
      <PageHeading>
        <Heading text={heading} />
      </PageHeading>
      {/*@ts-ignore*/}
      <PageContent>{content({ settings: props.settings })}</PageContent>
    </Content>
  )
}
